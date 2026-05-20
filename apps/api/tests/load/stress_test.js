import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up para 50 usuários simultâneos
    { duration: '1m', target: 50 },   // Carga constante de estresse
    { duration: '20s', target: 0 },   // Descida gradual (Ramp-down)
  ],
  thresholds: {
    // O erro deve ser < 1% mesmo sob carga massiva
    http_req_failed: ['rate<0.01'],
    // A latência de 95% das requisições deve ser inferior a 500ms
    http_req_duration: ['p(95)<500'],
  },
};

const API_URL = 'http://localhost:3000/api/accidents';
const TENANT_ID = 'uuid-tenant-test'; // Tenant de teste configurado no ambiente

export default function () {
  const payload = JSON.stringify({
    fullName: "Load Test User",
    lastName: "Stress Test",
    location: { lat: -23.5, lng: -46.6, address: "Av. Paulista, 100" },
    accidentType: 'collision',
    sceneData: { elements: [{ id: '1', type: 'car', x: 10, y: 10 }] }
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-id': TENANT_ID,
      'Authorization': 'Bearer token_de_teste_para_k6'
    },
  };

  const res = http.post(API_URL, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'transaction time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(0.5); // Intervalo entre requisições para não travar o loop de eventos do Node.js
}
