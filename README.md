# AmorSaúde GMUD - Sistema de Gerenciamento de Mudanças

![AmorSaúde GMUD Logo](https://via.placeholder.com/150x150.png?text=AmorSaúde+GMUD)

## 📋 Visão Geral

O AmorSaúde GMUD é um sistema avançado de Gerenciamento de Mudanças (GMUD) projetado para facilitar e documentar mudanças em ambientes de TI, com foco especial em desenvolvimento de software e operações de banco de dados. Este sistema permite uma abordagem estruturada para planejar, implementar e rastrear mudanças, minimizando riscos e garantindo a continuidade dos serviços.

### Características Principais

- 🔄 Suporte para GMUDs de Desenvolvimento e Banco de Dados
- 📝 Formulários detalhados para documentação completa de mudanças
- 💾 Armazenamento local de GMUDs para fácil acesso e edição
- 🖨️ Geração de documentos para impressão e compartilhamento
- 🔒 Planejamento de rollback para garantir a segurança das operações

## 🚀 Começando

Estas instruções fornecerão uma cópia do projeto em funcionamento na sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (como Live Server para VS Code) ou acesso a um servidor web

### Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/amorsaude-gmud.git
   ```

2. Navegue até o diretório do projeto:
   ```
   cd amorsaude-gmud
   ```

3. Abra o arquivo `index.html` em seu navegador ou use um servidor web local.

## 🖥️ Uso

1. Abra a aplicação no navegador.
2. Selecione o tipo de GMUD (Desenvolvimento ou Banco de Dados).
3. Preencha todos os campos relevantes do formulário.
4. Use os botões "Salvar GMUD", "Limpar Formulário" e "Gerar Documento" conforme necessário.
5. As GMUDs salvas aparecerão na lista no topo da página para fácil acesso e edição.

## 📚 Regras de Negócio

### GMUD de Desenvolvimento

- **Intuito das Alterações**: Documenta o propósito das mudanças, incluindo novas funcionalidades, correções de bugs, otimizações, etc.
- **Plano de Ação**: Detalha os passos para implementar as mudanças.
- **Implementação**: Especifica o método de implementação (manual, automatizada, CI/CD, etc.).
- **Cards do Jira**: Permite vincular a GMUD a cards específicos do Jira para rastreabilidade.

### GMUD de Banco de Dados

- **Scripts**: Requer a inclusão de scripts de alteração e rollback.
- **Responsabilidades**: Identifica quem executará e autorizará as mudanças no banco de dados.
- **Plano de Ação**: Específico para operações de banco de dados, incluindo backups e testes.

### Comum a Ambos os Tipos

- **Plano de Rollback**: Obrigatório para todas as GMUDs, detalhando como reverter as mudanças se necessário.
- **Testes Prévios**: Documentação dos testes realizados antes da implementação.
- **Comunicação**: Plano de comunicação aos stakeholders sobre as mudanças.

## 🛠️ Desenvolvido Com

- HTML5
- CSS3
- JavaScript (ES6+)
- [Animate.css](https://animate.style/) - Para animações

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

## 📜 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## 📞 Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - email@example.com

Link do Projeto: [https://github.com/seu-usuario/amorsaude-gmud](https://github.com/seu-usuario/amorsaude-gmud)

---

⌨️ com ❤️ por [Seu Nome](https://github.com/seu-usuario) 😊
