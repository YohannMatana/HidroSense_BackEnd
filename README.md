# 🌱 HidroSense - Sistema de Monitoramento de Umidade

HidroSense é um sistema completo de monitoramento de umidade do solo que integra sensores IoT com uma aplicação web moderna. O sistema utiliza comunicação MQTT para receber dados de sensores em tempo real e permite o controle remoto de parâmetros de irrigação.

## 🚀 Tecnologias Utilizadas

### Backend
- **Laravel 12** - Framework PHP moderno
- **PostgreSQL** - Banco de dados relacional
- **Laravel Sanctum** - Autenticação API
- **Laravel Fortify** - Autenticação completa com 2FA
- **PHP-MQTT** - Cliente MQTT para comunicação IoT

### Frontend
- **React 19** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Inertia.js** - SPA sem API
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Vite** - Build tool moderno

### Infraestrutura
- **Docker** - Containerização
- **Laravel Sail** - Ambiente de desenvolvimento
- **HiveMQ** - Broker MQTT público

## 📋 Funcionalidades

- ✅ **Monitoramento em Tempo Real**: Coleta automática de dados de umidade via MQTT
- ✅ **Dashboard Interativo**: Visualização dos dados coletados
- ✅ **Controle Remoto**: Configuração de limites de umidade
- ✅ **Autenticação Segura**: Sistema completo com 2FA opcional
- ✅ **API RESTful**: Endpoints para integração externa
- ✅ **Histórico de Dados**: Armazenamento e consulta de dados históricos

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker Desktop** (recomendado) ou:
  - PHP 8.3
  - Composer
  - Node.js 18+
  - PostgreSQL 17+

## 🚀 Instalação e Configuração

### Opção 1: Usando Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd HidroSense_BackEnd
```

2. **Configure o ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as configurações se necessário
# O arquivo já vem configurado para Docker
```

3. **Inicie os containers**
```bash
# Instale as dependências do Laravel Sail
composer install

# Inicie o ambiente Docker
./vendor/bin/sail up -d
```

4. **Configure a aplicação**
```bash
# Gere a chave da aplicação
./vendor/bin/sail artisan key:generate

# Execute as migrações
./vendor/bin/sail artisan migrate

# Instale dependências do frontend
./vendor/bin/sail npm install

# Compile os assets
./vendor/bin/sail npm run build
```

### Opção 2: Instalação Local

1. **Clone e configure**
```bash
git clone <url-do-repositorio>
cd HidroSense_BackEnd
cp .env.example .env
```

2. **Configure o banco de dados no .env**
```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=hidrosense
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

3. **Instale dependências**
```bash
# Backend
composer install

# Frontend
npm install
```

4. **Configure a aplicação**
```bash
# Gere a chave
php artisan key:generate

# Execute migrações
php artisan migrate

# Compile assets
npm run build
```

## 🎯 Como Executar

### Com Docker
```bash
# Inicie todos os serviços
./vendor/bin/sail up -d

# Acesse a aplicação
# Web: http://localhost:10000
# Banco: localhost:10001
```

### Sem Docker
```bash
# Terminal 1: Servidor Laravel
php artisan serve --port=10000

# Terminal 2: Vite (desenvolvimento)
npm run dev

# Terminal 3: Listener MQTT (opcional)
php artisan mqtt:listen
```

## 📡 Configuração MQTT

O sistema utiliza o broker público HiveMQ para comunicação:

- **Broker**: `broker.hivemq.com`
- **Porta**: `1883`
- **Tópicos**:
  - `hidrosense/umidade` - Recebe dados dos sensores
  - `hidrosense/limite` - Envia configurações de limite

### Comando para Escutar MQTT
```bash
# Com Docker
./vendor/bin/sail artisan mqtt:listen

# Sem Docker
php artisan mqtt:listen
```


```
├── app/
│   ├── Console/Commands/
│   │   └── MqttListen.php          # Comando para escutar MQTT
│   ├── Http/Controllers/
│   │   └── MqttController.php      # Controlador MQTT
│   └── Models/
│       ├── Umidade.php             # Model de umidade
│       └── User.php                # Model de usuário
├── database/migrations/            # Migrações do banco
├── resources/
│   ├── js/                        # Frontend React/TypeScript
│   └── css/                       # Estilos
├── routes/
│   ├── api.php                    # Rotas da API
│   ├── web.php                    # Rotas web
│   └── auth.php                   # Rotas de autenticação
└── compose.yaml                   # Configuração Docker
```

## 🔧 Comandos Úteis

```bash
# Limpar cache
./vendor/bin/sail artisan cache:clear

# Recriar banco de dados
./vendor/bin/sail artisan migrate:fresh

# Verificar logs
./vendor/bin/sail logs

# Acessar container
./vendor/bin/sail shell

# Parar containers
./vendor/bin/sail down
```

## 🐛 Solução de Problemas

### Erro de Permissão
```bash
sudo chown -R $USER:$USER .
chmod -R 755 storage bootstrap/cache
```

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Execute `./vendor/bin/sail artisan migrate`

### Erro MQTT
- Verifique conexão com internet
- Confirme se o broker HiveMQ está acessível
- Reinicie o comando `mqtt:listen`

## 📈 Próximos Passos

- [X] Implementar gráficos de histórico
- [ ] Adicionar alertas por email/SMS
- [ ] Criar app mobile
- [ ] Implementar múltiplos sensores
- [ ] Dashboard administrativo

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

**HidroSense** - Monitoramento inteligente para agricultura sustentável 🌱
