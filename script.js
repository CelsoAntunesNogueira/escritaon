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

// Funções de armazenamento usando localStorage
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

function renderCharacters() {
    const list = document.getElementById('characterList');
    const firstItem = list.firstElementChild;
    list.innerHTML = '';
    list.appendChild(firstItem);

    characters.forEach(char => {
        const item = document.createElement('div');
        item.className = 'character-item' + (selectedCharacterId === char.id ? ' active' : '');
        item.onclick = () => filterByCharacter(char.id);

        item.innerHTML = `
                    <div class="character-info">
                        <div class="character-color" style="background-color: ${char.color}"></div>
                        <div>
                            <div class="character-name">${char.name}</div>
                            ${char.role ? `<div class="character-role">${char.role}</div>` : ''}
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
    document.getElementById('eventModalTitle').textContent = 'Novo Evento';
    document.getElementById('eventForm').reset();
    renderEventCharacters();
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    editingEventId = null;
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    editingEventId = id;

    document.getElementById('eventModalTitle').textContent = 'Editar Evento';
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('eventDescription').value = event.description;

    renderEventCharacters(event.characters);
    document.getElementById('eventModal').classList.add('active');
}

function deleteEvent(id) {
    if (confirm('Deseja realmente excluir este evento?')) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        renderEvents();
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
    closeEventModal();
});

function openCharacterModal() {
    editingCharacterId = null;
    document.getElementById('characterModalTitle').textContent = 'Novo Personagem';
    document.getElementById('characterForm').reset();
    selectedColor = colors[0];
    renderColorPicker();
    document.getElementById('characterModal').classList.add('active');
}

function closeCharacterModal() {
    document.getElementById('characterModal').classList.remove('active');
    editingCharacterId = null;
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
    document.getElementById('characterModal').classList.add('active');
}

function deleteCharacter(id) {
    if (confirm('Deseja realmente excluir este personagem?')) {
        characters = characters.filter(c => c.id !== id);
        events = events.map(e => ({
            ...e,
            characters: e.characters.filter(cId => cId !== id)
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
        color: selectedColor
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

// Carregar dados ao iniciar
loadData();