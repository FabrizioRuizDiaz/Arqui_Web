
Load Balancer - Arqui Web

Load balancer HTTP en GCP repartiendo tráfico entre las dos instancias del proyecto (front + back en cada una).

IP del balanceador: 136.68.124.104

Cómo funciona

El usuario entra a http://136.68.124.104. GCP elige una de las dos VMs (round robin) y le manda el tráfico al puerto 80. En cada instancia, nginx sirve el build del frontend y manda /api/* al backend que corre local en el puerto 3001. Cada instancia tiene su propio front y back, no comparten nada entre sí.

	Load Balancer (136.68.124.104)
server-arqui-1                server-arqui-2
10.158.0.2 / 34.39.163.120     10.158.0.3 / 34.95.137.197

nginx:80 -> dist/ + proxy /api -> :3001
node:3001 (backend)

Requisitos previos antes de preparar el balanceador

Las dos VMs tienen que estar creadas y con el repo ya clonado
Front y back corriendo en cada una (front por nginx en el 80, back con node en el 3001)
El .env del front tiene que usar VITE_API_URL=/api (ruta relativa). Si le ponés la IP de una instancia a mano se rompe todo por CORS y de paso deja de tener sentido el balanceador, porque todo el tráfico de API terminaría yendo siempre al mismo server.

Qué se creó en GCP

allow-health-check: regla de firewall que deja pasar los health checks de Google (130.211.0.0/22 y 35.191.0.0/16) al puerto 80
arqui-web-group: instance group unmanaged con las dos VMs, puerto nombrado http:80
arqui-health-check: chequea / en el puerto 80 cada 10s
arqui-backend-service: junta el instance group con el health check
arqui-url-map + arqui-http-proxy: enrutamiento
arqui-lb-ip: la IP fija global, 136.68.124.104
arqui-http-forwarding-rule: la regla final que conecta todo

Comandos completos de la construccion del balanceador

bash# firewall
gcloud compute firewall-rules create allow-health-check \
  --network=default --direction=INGRESS --action=ALLOW \
  --rules=tcp:80 --source-ranges=130.211.0.0/22,35.191.0.0/16

# instance group
gcloud compute instance-groups unmanaged create arqui-web-group \
  --zone=southamerica-east1-c

gcloud compute instance-groups unmanaged add-instances arqui-web-group \
  --zone=southamerica-east1-c --instances=server-arqui-1,server-arqui-2

gcloud compute instance-groups unmanaged set-named-ports arqui-web-group \
  --zone=southamerica-east1-c --named-ports=http:80

# health check
gcloud compute health-checks create http arqui-health-check \
  --port=80 --request-path=/ --check-interval=10s --timeout=5s \
  --healthy-threshold=2 --unhealthy-threshold=3

# backend service
gcloud compute backend-services create arqui-backend-service \
  --protocol=HTTP --port-name=http --health-checks=arqui-health-check --global

gcloud compute backend-services add-backend arqui-backend-service \
  --instance-group=arqui-web-group --instance-group-zone=southamerica-east1-c --global

# url map, proxy, ip, forwarding rule
gcloud compute url-maps create arqui-url-map --default-service=arqui-backend-service

gcloud compute target-http-proxies create arqui-http-proxy --url-map=arqui-url-map

gcloud compute addresses create arqui-lb-ip --global

gcloud compute forwarding-rules create arqui-http-forwarding-rule \
  --global --target-http-proxy=arqui-http-proxy --ports=80 --address=arqui-lb-ip

nginx (en las dos instancias, mismo archivo)

/etc/nginx/sites-enabled/default:

nginxserver {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /home/tobicraft110/Arqui_Web/frontend/dist;
    index index.html;
    server_name _;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        try_files $uri /index.html;
    }
}
