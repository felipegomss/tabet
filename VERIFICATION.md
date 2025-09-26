# Verification Checklist
- [ ] **Action modal message** – Abrir uma aposta e confirmar que o modal mostra `Deseja realmente {ação} "{título}"?` com o título correto.
- [ ] **Nav reports (sidebar)** – Recarregar `/dashboard` para garantir ausência do aviso de hidratação relacionado aos relatórios desativados.
- [ ] **Masked inputs** – No formulário de aposta (`/bets`), digitar diretamente no campo `Valor (R$)` e confirmar que o valor renderizado corresponde ao digitado (ex.: `12` → `R$ 12,00`).
