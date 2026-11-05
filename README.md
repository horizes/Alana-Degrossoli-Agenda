# Alana Degrossoli · Agenda

[Abra a agenda](https://horizes.github.io/Alana-Degrossoli-Agenda/) · [Página de agendamento](https://horizes.github.io/Alana-Degrossoli-Agenda/agenda.html)

Agenda adaptada da Solvex para consultas de nutrição funcional. A paleta em vinho e creme foi mantida; os títulos e textos usam Alegreya Sans, com fontes hospedadas no próprio site. A composição mantém a apresentação à esquerda e o acesso em um painel à direita, com retrato real, títulos sem itálico e navegação direta.

O agendamento mostra um resumo do horário selecionado e o avanço das etapas. A opção de instalar o aplicativo aparece somente depois do login.

## Funcionamento

Backend `alana-agenda` ativo no Supabase, com tabelas `alana_agenda_*`, permissões, chaves de criptografia, limites e fila separados. O projeto Supabase de infraestrutura é compartilhado; a aplicação da Alana não consulta registros da Solvex. As tabelas não permitem acesso direto de usuários públicos ou autenticados; as operações passam pelo backend e verificam o perfil autorizado.

Acesso administrativo restrito a uma conta de demonstração. As credenciais são entregues separadamente e não fazem parte deste repositório.

Rotina: segunda a sexta, das 8h às 12h e das 14h às 18h, duração de 60 minutos e antecedência mínima de 60 minutos. A rotina e os formatos podem ser ajustados pelo painel.

Mantém calendário mensal, disponibilidade semanal, horários extras, bloqueios, reservas internas, reserva pública, recuperação da mesma tentativa, confirmação com protocolo e exportação de calendário. A regra da Solvex para atendimento presencial ocupa manhã ou tarde; consulte o manual.

Google Agenda/Meet usa o cliente OAuth Calend, com a URL de retorno desta agenda cadastrada. O Calend está externo e em produção: o responsável pode usar **Configurações → Conectar minha conta Google** e escolher a própria conta, sem cadastro como usuário de teste. A autorização final é feita pelo titular no Google. Depois de conectar, ative o Meet automático para novas consultas online. O Google mantém o limite de 100 autorizações para escopos não verificados; a verificação é necessária para remover esse limite.

A credencial OAuth fica somente no servidor. A aplicação pode reutilizar a credencial Calend da infraestrutura, mas mantém os tokens e os dados das contas conectadas exclusivos da agenda Alana. Nenhuma conta Google é vinculada automaticamente.

O remetente de e-mail ainda precisa ser configurado. Até isso ocorrer, o protocolo na página é a confirmação. O endereço presencial deve ser conferido nas configurações antes do uso real.

## Desenvolvimento

Frontend estático, sem etapa de build:

```sh
python -m http.server 8080
```

Após alterar os arquivos públicos, execute `node scripts/release.mjs` para atualizar o cache offline. Nunca publique chaves secretas, senhas ou credenciais OAuth em `config.js`.

[Manual](manual.html) · [Privacidade](privacidade-agenda.html) · [Uso da agenda](termos-agenda.html) · [Origem da marca](brand/README.md)

