# <img src="./public/icon.png" width="40"/> Vocabulary

Um web app para aprender novas palavras em formato de feed vertical, similar ao TikTok.

![](./public/images/print.png)

## Stack

- Vue
- TypeScript
- TailwindCSS
- Pinia
- Vite
- Bun
- Swiper

## Funcionalidades

- ✅️ 📚 Feed vertical de palavras com suas definições
- ✅️ 🔊 Pronúncias
- ✅️ 💾 Salvar palavras em uma coleção
- ✅️ 🎨 Temas customizáveis
- ✅️ 🖼️ Compartilhar palavras
- [ ] 💪 Exercícios de prática e revisão
- [ ] 🏷️ Seguir tópicos e categorias de palavras
- ✅️ 📲 Instalar web app na homescreen
- ✅️ ⚡️ Funcionamente Off-line (Android e Chrome apenas)
- [ ] 🌐 Internacionalização

## Iniciar localmente

```bash
bun install
bun run dev
```

O app estará disponível em [http://localhost:5173](http://localhost:5173/) no navegador.

## Gerar novas palavras

Este projeto possui uma skill local em `.agents/skills/new-words/SKILL.md` que é carregada pelo seu agente de IA para instruí-lo sobre as regras de geração de novas palavras.

Você pode simplesmente pedir `"Gere 100 novas palavras"` para seu agente.
