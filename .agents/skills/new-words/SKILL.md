---
name: new-words
description: Gerar novas palavras para serem mostradas no app. Use quando o usuário pedir para gerar novas palavras.
---

# Instruções

Gere palavras desconhecidas ou que não usamos no dia a dia para os usuários do meu app possam aprender.
Cada item deve ter a palavra, o significado, aplicação em uma frase, 3 sinônimos e 3 antônimos.
OBS: Não mostre sinônimos no campo meaning, somente o significado.
Ao gerar as palavras são siga em ordem alfabética, gere palavras com diferentes primeiras letras (Maior parte do alfabeto).
Não adicione palavras que já estão no arquivo ./data/words.json.
Não remova items do arquivo, apenas adicione novos registros.

Exemplo de um item que representa uma palavra:

```
{
  "word": "Inócuo",
  "meaning": "Que não causa dano ou prejuízo.",
  "sentence": "O medicamento mostrou-se inócuo, sem qualquer efeito colateral.",
  "synonyms": [
    "inofensivo",
    "inocente",
    "benigno"
  ],
  "antonyms": [
    "nocivo",
    "prejudicial",
    "danoso"
  ]
}
```

As novas palavras devem ser adicionadas no final do arquivo ./data/words.json
