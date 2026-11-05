# Alana Degrossoli · Agenda

Agenda de consultas de nutrição funcional adaptada de [horizes/Solvex-Agenda](https://github.com/horizes/Solvex-Agenda), revisão `46245df`. Mantém a interface da equipe, disponibilidade semanal, página pública, recuperação de tentativa, calendário, integração Google e instalação como aplicativo.

## Estado desta versão

O frontend está adaptado. O repositório de origem contém somente o frontend; o servidor, as tabelas, as funções, as credenciais Google e o serviço de e-mail não fazem parte dele.

**A configuração da Solvex foi removida.** A nova agenda não consulta nem altera os dados da Solvex. Sem um backend separado configurado, o login permanece desabilitado, não são exibidos horários fictícios e a página pública oferece o WhatsApp divulgado no perfil oficial para combinar a consulta com a equipe. Esse contato não confirma uma reserva automaticamente.

## Abrir localmente

Não há dependências de runtime nem etapa de build.

```sh
python -m http.server 8080
```

- Painel da equipe: `http://localhost:8080/`
- Agendamento: `http://localhost:8080/agenda.html`
- Manual: `http://localhost:8080/manual.html`

Publique os arquivos estáticos em uma hospedagem HTTPS. Funciona em um subdiretório, inclusive GitHub Pages. Use um domínio/origem separado da Solvex.

## Conectar a agenda de produção

1. Implante o backend compatível da Solvex em um projeto Supabase exclusivo, com tabelas e autenticação próprias. Este repositório não inclui o código desse backend e não o cria automaticamente.
2. Em `config.js`, preencha `supabaseUrl` e a chave **publishable** desse novo projeto. Não publique chaves secretas, `service_role`, credenciais OAuth ou senhas.
3. Configure `agendaFunction` com o nome da função implantada. O padrão `solvex-agenda` é apenas o nome do endpoint compatível; a URL do projeto determina qual backend será usado.
4. As respostas mantêm o formato `{ data: ... }` e os erros `{ error: { code, message } }`. Operações e nomes de campos foram preservados. O campo legado `company` agora representa **Tipo de consulta** (primeira consulta ou acompanhamento).
5. Crie o acesso autorizado da profissional, configure nome, objetivos disponíveis, endereço, rotina, duração e antecedência. Não há senha padrão no frontend.
6. Configure origens permitidas, retorno OAuth de `agenda-google-callback.html`, Google Agenda/Meet e remetente de e-mail no servidor. Tokens e segredos ficam somente no servidor.
7. Confira a regra herdada da Solvex que reserva manhã ou tarde para atendimento presencial. Se o consultório trabalhar com consultas presenciais consecutivas, ajuste a regra no backend antes de abrir reservas. A interface não altera essa regra por conta própria.
8. Valide uma reserva, conflito de horário, recuperação de tentativa, cancelamento, permissões por perfil e a integração Google no ambiente separado antes de receber pacientes.

A CSP permite conexões HTTPS para projetos `*.supabase.co`. O cliente usa somente a URL configurada. Após a implantação, pode-se restringir a CSP ao host específico do novo projeto em todas as páginas HTML.

## Manutenção

Os módulos do projeto original foram renomeados para arquivos legíveis em `assets/`. A identidade está em `assets/brand.css` e `brand/`. Os namespaces, sessões e cache são próprios desta versão.

Depois de editar arquivos públicos, rode `node scripts/release.mjs` para atualizar a versão do service worker. `config.js` e páginas com informações de atendimento não são armazenados no cache offline.

Consulte [o manual](manual.html), [privacidade](privacidade-agenda.html), [uso da agenda](termos-agenda.html) e [a origem da marca](brand/README.md).
