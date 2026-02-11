/** * VibeCal Color Edition
 */
let events = JSON.parse(localStorage.getItem('vibe_color_events')) || {};
let viewDate = new Date();
let selectedKey = null;

const grid = document.getElementById('calendarGrid');
const monthLabel = document.getElementById('monthDisplay');
const panel = document.getElementById('editor');

function init() {
    render();
    document.getElementById('prevMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); render(); };
    document.getElementById('nextMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); render(); };
    document.getElementById('addBtn').onclick = saveEvent;
    document.getElementById('closePanel').onclick = () => panel.classList.remove('open');
}

function render() {
    grid.innerHTML = '';
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewDate);

    let startDay = new Date(year, month, 1).getDay();
    startDay = (startDay === 0) ? 6 : startDay - 1; 

    const totalDays = new Date(year, month + 1, 0).getDate();

    for(let i=0; i < startDay; i++) {
        const p = document.createElement('div');
        p.className = 'day-cell padding';
        grid.appendChild(p);
    }

    for(let d=1; d <= totalDays; d++) {
        const key = `${year}-${month + 1}-${d}`;
        const dayEvents = events[key] || [];
        
        const cell = document.createElement('div');
        cell.className = `day-cell ${dayEvents.length > 0 ? 'has-events' : ''}`;
        
        // Render pills with saved background colors
        const eventHtml = dayEvents.slice(0, 3).map(e => 
            `<div class="event-item" style="background:${e.color}">${e.text}</div>`
        ).join('');

        cell.innerHTML = `
            <span class="date-num">${d}</span>
            <div class="cell-events">${eventHtml}</div>
        `;

        cell.onclick = () => openEditor(key, d);
        grid.appendChild(cell);
    }
}

function saveEvent() {
    const input = document.getElementById('eventInput');
    const color = document.querySelector('input[name="color"]:checked').value;
    
    if(!input.value.trim()) return;
    
    if(!events[selectedKey]) events[selectedKey] = [];
    
    // Save as object
    events[selectedKey].push({
        text: input.value.trim(),
        color: color
    });
    
    localStorage.setItem('vibe_color_events', JSON.stringify(events));
    input.value = '';
    refreshPanelList();
    render();
}

function openEditor(key, num) {
    selectedKey = key;
    document.getElementById('selectedDateText').innerText = `Day ${num}`;
    panel.classList.add('open');
    refreshPanelList();
}

function refreshPanelList() {
    const list = document.getElementById('panelEventList');
    const dayEvts = events[selectedKey] || [];
    list.innerHTML = dayEvts.map((e, i) => `
        <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.8rem; background:${e.color}; padding:8px; border-radius:6px; color:white;">
            ${e.text} 
            <button onclick="delEv(${i})" style="color:white; background:rgba(0,0,0,0.2); border:none; border-radius:4px; cursor:pointer;">✕</button>
        </div>
    `).join('');
}

window.delEv = (i) => {
    events[selectedKey].splice(i, 1);
    localStorage.setItem('vibe_color_events', JSON.stringify(events));
    refreshPanelList();
    render();
}

init();