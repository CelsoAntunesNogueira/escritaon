# 📚 Linha Temporal Interativa para Escritores

Uma ferramenta web elegante e intuitiva para escritores organizarem eventos e personagens de suas histórias de forma visual e cronológica.

![Preview](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Características

- 📅 **Linha Temporal Cronológica** - Visualize eventos em ordem temporal
- 👤 **Gerenciamento de Personagens** - Crie e organize personagens com cores personalizadas
- 🏷️ **Categorização de Eventos** - Organize por Enredo, Personagem, Mundo ou Conflito
- 🔍 **Filtros Inteligentes** - Filtre eventos por personagem específico
- 💾 **Salvamento Automático** - Dados salvos localmente no navegador
- 🎨 **Interface Moderna** - Design responsivo com gradientes e efeitos visuais
- ⚡ **Zero Dependências** - HTML, CSS e JavaScript puro


## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Gradients, Backdrop Filter)
- JavaScript (ES6+)
- LocalStorage API


## 💡 Como Usar

### Criando Personagens

1. Clique no botão **+** ao lado de "Personagens"
2. Preencha nome, papel e descrição
3. Escolha uma cor para identificação visual
4. Clique em "Salvar"

### Adicionando Eventos

1. Clique em **+ Adicionar Evento**
2. Preencha os detalhes do evento:
   - **Título**: Nome do evento
   - **Data**: Quando acontece na história
   - **Categoria**: Tipo de evento (Enredo, Personagem, Mundo, Conflito)
   - **Descrição**: Detalhes sobre o que acontece
   - **Personagens**: Selecione quais personagens estão envolvidos
3. Clique em "Salvar"

### Filtrando Eventos

- Clique em um personagem na barra lateral para ver apenas eventos relacionados a ele
- Clique em "Todos os eventos" para ver a linha temporal completa

### Editando e Excluindo

- Passe o mouse sobre eventos ou personagens para ver os botões de edição (✏️) e exclusão (🗑️)
- Clique para editar ou excluir conforme necessário

## 🎨 Personalização

### Alterando Cores do Tema

Edite as variáveis CSS no início do arquivo `index.html`:
```css
background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
```

### Adicionando Mais Cores para Personagens

No JavaScript, adicione cores ao array:
```javascript
const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#ef4444', '#06b6d4', '#6366f1',
    '#sua-cor-aqui' // Adicione mais cores
];
```

### Criando Novas Categorias

Adicione categorias ao objeto:
```javascript
const categories = {
    plot: { label: 'Enredo', color: '#3b82f6' },
    character: { label: 'Personagem', color: '#8b5cf6' },
    world: { label: 'Mundo', color: '#10b981' },
    conflict: { label: 'Conflito', color: '#ef4444' },
    suacategoria: { label: 'Sua Categoria', color: '#sua-cor' }
};
```

## 💾 Armazenamento de Dados

Os dados são salvos automaticamente no **localStorage** do navegador. Isso significa:

- ✅ Dados persistem entre sessões
- ✅ Funciona offline
- ✅ Sem necessidade de servidor
- ⚠️ Dados são específicos do navegador/dispositivo
- ⚠️ Limpar cache do navegador apaga os dados

### Backup Manual

Para fazer backup dos seus dados:

1. Abra o Console do navegador (F12)
2. Execute:
```javascript
console.log(localStorage.getItem('timeline-events'));
console.log(localStorage.getItem('timeline-characters'));
```
3. Copie e salve o resultado em um arquivo

### Restaurar Backup

1. Abra o Console do navegador (F12)
2. Execute:
```javascript
localStorage.setItem('timeline-events', 'SEU_BACKUP_AQUI');
localStorage.setItem('timeline-characters', 'SEU_BACKUP_AQUI');
```
3. Recarregue a página

## 🔮 Recursos Futuros

- [ ] Exportar/Importar dados em JSON
- [ ] Múltiplas linhas temporais (projetos diferentes)
- [ ] Modo escuro/claro
- [ ] Visualização em calendário
- [ ] Relacionamentos entre personagens
- [ ] Tags e etiquetas customizadas
- [ ] Busca global
- [ ] Atalhos de teclado
- [ ] Modo de impressão
- [ ] Sincronização na nuvem (opcional)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📝 Ideias de Contribuição

- Adicionar temas de cores
- Implementar drag-and-drop para reordenar eventos
- Criar visualizações alternativas (calendário, kanban)
- Adicionar sistema de tags
- Implementar busca avançada
- Melhorar acessibilidade (ARIA labels)
- Adicionar suporte a markdown nas descrições

## 🐛 Reportando Bugs

Encontrou um bug? [Abra uma issue](https://github.com/seu-usuario/timeline-escritor/issues) com:

- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Navegador e versão

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para escritores organizarem suas histórias

## 🙏 Agradecimentos

- Inspirado pela necessidade de ferramentas simples e eficazes para escritores
- Comunidade de escritores que testaram e deram feedback
- Todos os contribuidores do projeto

## 📞 Suporte

Se você gostou do projeto:

- ⭐ Dê uma estrela no GitHub
- 🐛 Reporte bugs
- 💡 Sugira novas funcionalidades
- 🤝 Contribua com código

---

**Nota:** Este é um projeto de código aberto criado para auxiliar escritores. Sinta-se livre para usar, modificar e distribuir conforme necessário.
