const categories = {
    plot: { label: 'Enredo', color: '#3b82f6' },
    character: { label: 'Personagem', color: '#8b5cf6' },
    world: { label: 'Mundo', color: '#10b981' },
    conflict: { label: 'Conflito', color: '#ef4444' }
};

const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#ef4444', '#06b6d4', '#6366f1'
];

let events = [];
let characters = [];
let editingEventId = null;
let editingCharacterId = null;
let selectedCharacterId = null;
let selectedColor = colors[0];
let currentTags = [];
let currentRelationships = [];
let currentView = 'timeline';
let currentDate = new Date();

function loadData() {
    try {
        const eventsData = localStorage.getItem('timeline-events');
        const charactersData = localStorage.getItem('timeline-characters');

        if (eventsData) events = JSON.parse(eventsData);
        if (charactersData) characters = JSON.parse(charactersData);
    } catch (error) {
        console.log('Iniciando com dados vazios');
        events = [];
        characters = [];
    }

    renderCharacters();
    renderEvents();
    renderCalendar();
}

function saveEvents() {
    try {
        localStorage.setItem('timeline-events', JSON.stringify(events));
    } catch (error) {
        console.error('Erro ao salvar eventos:', error);
        alert('Erro ao salvar eventos. Verifique o espaço disponível no navegador.');
    }
}

function saveCharacters() {
    try {
        localStorage.setItem('timeline-characters', JSON.stringify(characters));
    } catch (error) {
        console.error('Erro ao salvar personagens:', error);
        alert('Erro ao salvar personagens. Verifique o espaço disponível no navegador.');
    }
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (view === 'timeline') {
        document.getElementById('timelineView').classList.add('active');
        document.getElementById('calendarView').classList.remove('active');
        document.getElementById('viewTitle').textContent = '📅 Eventos';
    } else {
        document.getElementById('timelineView').classList.remove('active');
        document.getElementById('calendarView').classList.add('active');
        document.getElementById('viewTitle').textContent = '🗓️ Calendário';
        renderCalendar();
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthYear = document.getElementById('currentMonth');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    grid.innerHTML = '';

    // Dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        const header = document.createElement('div');
        header.style.fontWeight = '600';
        header.style.textAlign = 'center';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Dias vazios no início
    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement('div'));
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);

        // Adicionar eventos do dia
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(e => e.date === dateStr);

        dayEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'calendar-event';
            eventDiv.style.backgroundColor = categories[event.category].color + '80';
            eventDiv.textContent = event.title;
            eventDiv.onclick = () => editEvent(event.id);
            dayDiv.appendChild(eventDiv);
        });

        grid.appendChild(dayDiv);
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function addTag() {
    const input = document.getElementById('tagInput');
    const tag = input.value.trim();

    if (tag && !currentTags.includes(tag)) {
        currentTags.push(tag);
        renderTags();
        input.value = '';
    }
}

function removeTag(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    renderTags();
}

function renderTags() {
    const container = document.getElementById('eventTagsList');
    container.innerHTML = '';

    currentTags.forEach(tag => {
        const tagDiv = document.createElement('div');
        tagDiv.className = 'tag-item';
        tagDiv.innerHTML = `
                    <span>${tag}</span>
                    <span class="tag-remove" onclick="removeTag('${tag}')">×</span>
                `;
        container.appendChild(tagDiv);
    });
}

function addRelationship() {
    const container = document.getElementById('relationshipsContainer');
    const relationDiv = document.createElement('div');
    relationDiv.className = 'relationship-item';

    const select = document.createElement('select');
    select.style.flex = '1';
    select.style.marginRight = '0.5rem';
    select.innerHTML = '<option value="">Selecione um personagem</option>';

    characters.forEach(char => {
        if (!editingCharacterId || char.id !== editingCharacterId) {
            select.innerHTML += `<option value="${char.id}">${char.name}</option>`;
        }
    });

    const relationInput = document.createElement('input');
    relationInput.type = 'text';
    relationInput.placeholder = 'Ex: Amigo, Inimigo, Irmão...';
    relationInput.style.flex = '1';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-small';
    removeBtn.style.background = '#ef4444';
    removeBtn.textContent = '×';
    removeBtn.onclick = () => relationDiv.remove();

    relationDiv.appendChild(select);
    relationDiv.appendChild(relationInput);
    relationDiv.appendChild(removeBtn);
    container.appendChild(relationDiv);
}

function getRelationships() {
    const items = document.querySelectorAll('#relationshipsContainer .relationship-item');
    const relationships = [];

    items.forEach(item => {
        const select = item.querySelector('select');
        const input = item.querySelector('input');

        if (select.value && input.value) {
            relationships.push({
                characterId: parseInt(select.value),
                type: input.value
            });
        }
    });

    return relationships;
}

function renderRelationships(relationships = []) {
    const container = document.getElementById('relationshipsContainer');
    container.innerHTML = '';

    relationships.forEach(rel => {
        addRelationship();
        const items = container.querySelectorAll('.relationship-item');
        const lastItem = items[items.length - 1];
        lastItem.querySelector('select').value = rel.characterId;
        lastItem.querySelector('input').value = rel.type;
    });
}

function toggleDropdown() {
    const dropdown = document.getElementById('exportDropdown');
    dropdown.classList.toggle('active');
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('exportDropdown');
    if (!e.target.closest('.dropdown-menu')) {
        dropdown.classList.remove('active');
    }
});

function exportJSON() {
    const data = {
        events: events,
        characters: characters,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toggleDropdown();
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;
    doc.setFontSize(16);
    doc.text('Linha Temporal da História', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Exportado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, y);
    y += 15;

    doc.setFontSize(14);
    doc.text('Personagens:', 20, y);
    y += 8;

    doc.setFontSize(10);
    characters.forEach(char => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.text(`• ${char.name}${char.role ? ' - ' + char.role : ''}`, 25, y);
        y += 6;

        if (char.relationships && char.relationships.length > 0) {
            char.relationships.forEach(rel => {
                const relChar = characters.find(c => c.id === rel.characterId);
                if (relChar) {
                    doc.text(`  → ${rel.type}: ${relChar.name}`, 30, y);
                    y += 5;
                }
            });
        }
    });

    y += 10;
    doc.setFontSize(14);
    doc.text('Eventos:', 20, y);
    y += 8;

    doc.setFontSize(10);
    events.forEach(event => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.text(`${formatDate(event.date)} - ${event.title}`, 25, y);
        y += 6;
        doc.text(`Categoria: ${categories[event.category].label}`, 30, y);
        y += 5;

        if (event.description) {
            const lines = doc.splitTextToSize(event.description, 160);
            lines.forEach(line => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, 30, y);
                y += 5;
            });
        }

        if (event.tags && event.tags.length > 0) {
            doc.text(`Tags: ${event.tags.join(', ')}`, 30, y);
            y += 5;
        }

        y += 5;
    });

    doc.save(`timeline-${new Date().toISOString().split('T')[0]}.pdf`);
    toggleDropdown();
}

function exportDOC() {
    let content = `LINHA TEMPORAL DA HISTÓRIA\n`;
    content += `Exportado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    content += `${'='.repeat(50)}\n\n`;

    content += `PERSONAGENS\n\n`;
    characters.forEach(char => {
        content += `• ${char.name}${char.role ? ' - ' + char.role : ''}\n`;
        if (char.description) {
            content += `  ${char.description}\n`;
        }
        if (char.relationships && char.relationships.length > 0) {
            char.relationships.forEach(rel => {
                const relChar = characters.find(c => c.id === rel.characterId);
                if (relChar) {
                    content += `  → ${rel.type}: ${relChar.name}\n`;
                }
            });
        }
        content += `\n`;
    });

    content += `\n${'='.repeat(50)}\n\n`;
    content += `EVENTOS\n\n`;

    events.forEach(event => {
        content += `${formatDate(event.date)} - ${event.title}\n`;
        content += `Categoria: ${categories[event.category].label}\n`;

        if (event.description) {
            content += `${event.description}\n`;
        }

        if (event.characters && event.characters.length > 0) {
            const eventChars = characters.filter(c => event.characters.includes(c.id));
            content += `Personagens: ${eventChars.map(c => c.name).join(', ')}\n`;
        }

        if (event.tags && event.tags.length > 0) {
            content += `Tags: ${event.tags.join(', ')}\n`;
        }

        content += `\n${'-'.repeat(50)}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toggleDropdown();
}

function importData() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            if (confirm('Isso substituirá todos os dados atuais. Deseja continuar?')) {
                events = data.events || [];
                characters = data.characters || [];

                saveEvents();
                saveCharacters();

                renderCharacters();
                renderEvents();
                renderCalendar();

                alert('Dados importados com sucesso!');
            }
        } catch (error) {
            alert('Erro ao importar dados. Verifique se o arquivo é válido.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function renderCharacters() {
    const list = document.getElementById('characterList');
    const firstItem = list.firstElementChild;
    list.innerHTML = '';
    list.appendChild(firstItem);

    characters.forEach(char => {
        const item = document.createElement('div');
        item.className = 'character-item' + (selectedCharacterId === char.id ? ' active' : '');
        item.onclick = () => filterByCharacter(char.id);

        let relationshipsHTML = '';
        if (char.relationships && char.relationships.length > 0) {
            const relTexts = char.relationships.map(rel => {
                const relChar = characters.find(c => c.id === rel.characterId);
                return relChar ? `${rel.type}: ${relChar.name}` : '';
            }).filter(Boolean);

            if (relTexts.length > 0) {
                relationshipsHTML = `<div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem;">${relTexts.join(', ')}</div>`;
            }
        }

        item.innerHTML = `
                    <div class="character-info">
                        <div class="character-color" style="background-color: ${char.color}"></div>
                        <div style="flex: 1;">
                            <div class="character-name">${char.name}</div>
                            ${char.role ? `<div class="character-role">${char.role}</div>` : ''}
                            ${relationshipsHTML}
                        </div>
                    </div>
                    <div class="character-actions">
                        <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); editCharacter(${char.id})">✏️</button>
                        <button class="btn btn-small" style="background: #ef4444;" onclick="event.stopPropagation(); deleteCharacter(${char.id})">🗑️</button>
                    </div>
                `;
        list.appendChild(item);
    });
}

function renderEvents() {
    const list = document.getElementById('eventList');
    const filteredEvents = selectedCharacterId
        ? events.filter(e => e.characters.includes(selectedCharacterId))
        : events;

    if (filteredEvents.length === 0) {
        list.innerHTML = '<div class="empty-state">Nenhum evento adicionado ainda</div>';
        return;
    }

    list.innerHTML = '';
    filteredEvents.forEach(event => {
        const eventChars = characters.filter(c => event.characters.includes(c.id));
        const category = categories[event.category];

        const item = document.createElement('div');
        item.className = 'event';
        item.innerHTML = `
                    <div class="event-dot" style="background-color: ${category.color}"></div>
                    <div class="event-header">
                        <div style="flex: 1;">
                            <div class="event-meta">
                                <span class="event-category" style="background-color: ${category.color}">${category.label}</span>
                                <span class="event-date">${formatDate(event.date)}</span>
                            </div>
                            <div class="event-title">${event.title}</div>
                            ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                        </div>
                        <div class="event-actions">
                            <button class="btn btn-primary btn-small" onclick="editEvent(${event.id})">✏️</button>
                            <button class="btn btn-small" style="background: #ef4444;" onclick="deleteEvent(${event.id})">🗑️</button>
                        </div>
                    </div>
                    ${event.tags && event.tags.length > 0 ? `
                        <div class="event-tags">
                            ${event.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${eventChars.length > 0 ? `
                        <div class="event-characters">
                            ${eventChars.map(c => `
                                <span class="event-character-tag" style="background-color: ${c.color}40; color: ${c.color}">
                                    ${c.name}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                `;
        list.appendChild(item);
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

function filterByCharacter(charId) {
    selectedCharacterId = charId;
    renderCharacters();
    renderEvents();
}

function openEventModal() {
    editingEventId = null;
    currentTags = [];
    document.getElementById('eventModalTitle').textContent = 'Novo Evento';
    document.getElementById('eventForm').reset();
    renderEventCharacters();
    renderTags();
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    editingEventId = null;
    currentTags = [];
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    editingEventId = id;
    currentTags = event.tags || [];

    document.getElementById('eventModalTitle').textContent = 'Editar Evento';
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('eventDescription').value = event.description;

    renderEventCharacters(event.characters);
    renderTags();
    document.getElementById('eventModal').classList.add('active');
}

function deleteEvent(id) {
    if (confirm('Deseja realmente excluir este evento?')) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        renderEvents();
        renderCalendar();
    }
}

function renderEventCharacters(selectedChars = []) {
    const container = document.getElementById('eventCharacters');
    container.innerHTML = '';

    characters.forEach(char => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';
        item.innerHTML = `
                    <input type="checkbox" id="char-${char.id}" value="${char.id}" ${selectedChars.includes(char.id) ? 'checked' : ''}>
                    <div class="character-color" style="background-color: ${char.color}"></div>
                    <label for="char-${char.id}" style="cursor: pointer;">${char.name}</label>
                `;
        container.appendChild(item);
    });
}

document.getElementById('eventForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedChars = Array.from(document.querySelectorAll('#eventCharacters input:checked'))
        .map(cb => parseInt(cb.value));

    const eventData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        category: document.getElementById('eventCategory').value,
        description: document.getElementById('eventDescription').value,
        characters: selectedChars,
        tags: currentTags,
        timestamp: new Date(document.getElementById('eventDate').value).getTime()
    };

    if (editingEventId) {
        events = events.map(e => e.id === editingEventId ? { ...eventData, id: e.id } : e);
    } else {
        eventData.id = Date.now();
        events.push(eventData);
    }

    events.sort((a, b) => a.timestamp - b.timestamp);
    saveEvents();
    renderEvents();
    renderCalendar();
    closeEventModal();
});

function openCharacterModal() {
    editingCharacterId = null;
    currentRelationships = [];
    document.getElementById('characterModalTitle').textContent = 'Novo Personagem';
    document.getElementById('characterForm').reset();
    selectedColor = colors[0];
    renderColorPicker();
    renderRelationships();
    document.getElementById('characterModal').classList.add('active');
}

function closeCharacterModal() {
    document.getElementById('characterModal').classList.remove('active');
    editingCharacterId = null;
    currentRelationships = [];
}

function editCharacter(id) {
    const char = characters.find(c => c.id === id);
    editingCharacterId = id;
    selectedColor = char.color;

    document.getElementById('characterModalTitle').textContent = 'Editar Personagem';
    document.getElementById('characterName').value = char.name;
    document.getElementById('characterRole').value = char.role;
    document.getElementById('characterDescription').value = char.description;

    renderColorPicker();
    renderRelationships(char.relationships || []);
    document.getElementById('characterModal').classList.add('active');
}

function deleteCharacter(id) {
    if (confirm('Deseja realmente excluir este personagem?')) {
        characters = characters.filter(c => c.id !== id);
        events = events.map(e => ({
            ...e,
            characters: e.characters.filter(cId => cId !== id)
        }));

        // Remove relacionamentos
        characters = characters.map(c => ({
            ...c,
            relationships: (c.relationships || []).filter(r => r.characterId !== id)
        }));

        saveCharacters();
        saveEvents();
        renderCharacters();
        renderEvents();
    }
}

function renderColorPicker() {
    const picker = document.getElementById('colorPicker');
    picker.innerHTML = '';

    colors.forEach(color => {
        const option = document.createElement('div');
        option.className = 'color-option' + (color === selectedColor ? ' selected' : '');
        option.style.backgroundColor = color;
        option.onclick = () => {
            selectedColor = color;
            renderColorPicker();
        };
        picker.appendChild(option);
    });
}

document.getElementById('characterForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const charData = {
        name: document.getElementById('characterName').value,
        role: document.getElementById('characterRole').value,
        description: document.getElementById('characterDescription').value,
        color: selectedColor,
        relationships: getRelationships()
    };

    if (editingCharacterId) {
        characters = characters.map(c => c.id === editingCharacterId ? { ...charData, id: c.id } : c);
    } else {
        charData.id = Date.now();
        characters.push(charData);
    }

    saveCharacters();
    renderCharacters();
    renderEventCharacters();
    closeCharacterModal();
});

// Enter para adicionar tag
document.getElementById('tagInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
    }
});

loadData();
