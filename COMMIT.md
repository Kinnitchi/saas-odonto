2# 📌 Padrões de Commits

Este guia define uma convenção para mensagens de commit, facilitando o entendimento das mudanças realizadas no projeto.

| Tipo     | Emoji | Finalidade                                      | Exemplo                                |
| -------- | :---: | ----------------------------------------------- | -------------------------------------- |
| feat     |   ✨   | Adicionar uma nova funcionalidade               | `feat(auth): add JWT support`          |
| fix      |   🐛   | Corrigir um bug                                 | `fix(api): handle null response`       |
| refactor |   ♻️   | Reescrever o código sem alterar o comportamento | `refactor(core): cleanup utils`        |
| perf     |   🚀   | Melhorar o desempenho do código                 | `perf(db): reduce query time`          |
| style    |   🎨   | Ajustar o estilo ou formatação do código        | `style: format code with prettier`     |
| test     |   ✅   | Adicionar ou corrigir testes                    | `test(api): add integration tests`     |
| docs     |   📝   | Atualizar documentação                          | `docs(readme): update usage section`   |
| build    |   🔧   | Alterar dependências ou configurações de build  | `build(deps): bump axios to 1.7.0`     |
| ci       |   ⚙️   | Ajustar scripts ou configurações de CI          | `ci(actions): update node version`     |
| ops      |   🧰   | Modificar infraestrutura ou processos de deploy | `ops(docker): add production compose`  |
| chore    |   🧹   | Executar tarefas que não afetam o código        | `chore: remove unused scripts`         |
| revert   |   🗑️   | Reverter uma alteração anterior                 | `revert: feat(api): add user endpoint` |

---

✅ **Dicas para mensagens de commit**
- Use sempre o tipo no início: `tipo(contexto): descrição curta`
- Utilize o contexto entre parênteses para detalhar onde a mudança ocorreu
- A descrição deve ser no imperativo e objetiva

Ex.:
```sh
git commit -m "feat(login): implement remember me"
