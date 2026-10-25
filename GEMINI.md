# Regras do Projeto

## Sincronização Automática com o GitHub
Toda vez que concluir o atendimento a um prompt ou solicitação do usuário neste projeto, execute automaticamente o fluxo de deploy/push para o GitHub antes de finalizar a resposta:
1. Executar o build estático (`npm run build`), se houver alterações nos assets/código.
2. Verificar o status do git (`git status`).
3. Adicionar as alterações pertinentes ao stage (`git add .`).
4. Criar um commit com mensagem clara e semântica (Conventional Commits, ex.: `feat: ...`, `fix: ...`, `chore: ...`).
5. Enviar as alterações para o repositório remoto no GitHub (`git push`).
6. Informar ao usuário na resposta o resumo do commit e a confirmação do push efetuado.
