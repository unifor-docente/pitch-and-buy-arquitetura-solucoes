# Exemplo de Proposta — HealthNow

---

## 1. Identificação

- Nome da solução: HealthNow
- Nome da equipe: Exemplo
- Integrantes: Aluno 1, Aluno 2, Aluno 3

---

## 2. Visão Geral da Solução

O HealthNow é uma plataforma digital que conecta pacientes a médicos disponíveis em tempo real, permitindo consultas rápidas por vídeo.

A solução busca reduzir o tempo de espera por atendimento médico e facilitar o acesso à saúde, especialmente em situações de baixa urgência.

---

## 3. Problema

Atualmente, muitos pacientes enfrentam dificuldades para conseguir atendimento médico rápido, especialmente em situações que não são emergenciais.

Isso gera:

- Filas em hospitais
- Sobrecarga no sistema de saúde
- Demora no atendimento

---

## 4. Público-Alvo

- Pacientes que precisam de atendimento rápido
- Pessoas com dificuldade de deslocamento
- Usuários de planos de saúde ou particulares

---

## 5. Contexto do Negócio

A solução se insere no contexto de telemedicina, que cresceu significativamente com a digitalização dos serviços de saúde.

Restrições:

- Necessidade de segurança de dados (LGPD)
- Alta disponibilidade
- Confiabilidade no atendimento

---

## 6. Descrição da Solução

O usuário acessa a plataforma, realiza login e solicita uma consulta.

O sistema:

1. Identifica médicos disponíveis
2. Conecta paciente e médico
3. Realiza consulta por vídeo
4. Registra histórico
5. Permite pagamento integrado

---

## 7. Arquitetura

- Dica: Criar os diagramas usando draw.io ou plantuml [PlantUML](https://www.plantuml.com/)

### Diagrama de Contexto (C4)

Elementos principais:

- Usuário (paciente)
- Sistema HealthNow
- Sistema de pagamento
- Serviço de notificação
- Sistema de autenticação

![Diagrama de Contexto - HealthNow](./imgs/diagrama-contexto)

---

### Diagrama de Containers (C4)

- Frontend Web/Mobile
- Backend API
- Banco de dados PostgreSQL
- Serviço de autenticação
- Serviço de vídeo (terceiro)
- Mensageria para notificações

![Diagrama de Containers - HealthNow](./imgs/diagrama-containers)

---

## 8. Tecnologias Utilizadas

- Frontend: React (facilidade de desenvolvimento e comunidade)
- Backend: Node.js / NestJS (escalabilidade e organização)
- Banco: PostgreSQL (dados estruturados)
- Cloud: AWS (escalabilidade)
- Mensageria: SQS (processamento assíncrono)

---

## 9. Requisitos

### Funcionais

- RF01: Cadastro de usuários
- RF02: Agendamento de consulta
- RF03: Consulta por vídeo
- RF04: Histórico de consultas

---

### Não Funcionais

- RNF01: Alta disponibilidade
- RNF02: Segurança de dados
- RNF03: Baixa latência

---

## 10. Integrações

- Gateway de pagamento
- Serviço de vídeo (ex: WebRTC ou API externa)
- Serviço de envio de notificações

---

## 11. Comunicação

- REST para operações principais (login, consulta, dados)
- Eventos para:
  - envio de notificações
  - registro de histórico
- Uso de filas para desacoplamento

---

## 12. Atributos de Qualidade

### Escalabilidade
Uso de containers e cloud para escalar horizontalmente.

### Disponibilidade
Uso de múltiplas instâncias e redundância.

### Segurança
Autenticação, autorização e criptografia de dados.

### Observabilidade
Logs, métricas e monitoramento.

---

## 13. Deploy

- Cloud AWS
- Containers (Docker)
- Orquestração (ECS ou Kubernetes)
- Estratégia de deploy: Rolling update

---

## 14. Custos (FinOps básico)

Principais custos:

- Infraestrutura cloud
- Processamento de vídeo
- Banco de dados

Otimizações:

- Autoscaling
- Uso sob demanda

---

## 15. Riscos

- Dependência de serviço de vídeo
- Falha em pagamento
- Indisponibilidade do sistema

---

## 16. Trade-offs

- Uso de cloud → maior custo, maior escalabilidade
- Uso de eventos → maior complexidade, maior desacoplamento

---

## 17. Justificativa

A arquitetura foi escolhida visando escalabilidade, alta disponibilidade e capacidade de crescimento.

O uso de cloud e mensageria permite lidar com variações de carga e garantir melhor experiência ao usuário.

---

## 18. Evolução

A solução pode evoluir para:

- Uso de inteligência artificial
- Integração com planos de saúde
- Expansão para atendimento internacional

---

## 19. Pitch

O HealthNow resolve o problema de acesso lento a consultas médicas, conectando pacientes a médicos em tempo real.

A solução é escalável, segura e preparada para crescimento, utilizando arquitetura moderna baseada em cloud e eventos.

---

## 20. Conclusão

A proposta apresenta uma solução viável para um problema real, com arquitetura adequada, escalável e alinhada às necessidades do negócio.

---

## Observação

Este documento é apenas um exemplo para orientação.

Cada equipe deve desenvolver sua própria solução, considerando seu contexto e decisões arquiteturais.