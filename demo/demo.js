/**
 * Lightning Calendar Core Demo
 */

// Simple demo implementation since we're loading from the browser
class CalendarDemo {
    constructor() {
        this.events = [];
        this.currentView = 'month';
        this.currentDate = new Date();
        this.selectedEvent = null;
        this.eventIdCounter = 1;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleEvents();
        this.render();
        this.updateStatistics();
    }

    setupEventListeners() {
        // View buttons
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.render();
            });
        });

        // Navigation
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentView === 'month') {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            } else if (this.currentView === 'week') {
                this.currentDate.setDate(this.currentDate.getDate() - 7);
            } else {
                this.currentDate.setDate(this.currentDate.getDate() - 1);
            }
            this.render();
        });

        document.getElementById('todayBtn').addEventListener('click', () => {
            this.currentDate = new Date();
            this.render();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (this.currentView === 'month') {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            } else if (this.currentView === 'week') {
                this.currentDate.setDate(this.currentDate.getDate() + 7);
            } else {
                this.currentDate.setDate(this.currentDate.getDate() + 1);
            }
            this.render();
        });

        // Actions
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.addRandomEvent();
        });

        document.getElementById('detectConflictsBtn').addEventListener('click', () => {
            this.detectConflicts();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.events = [];
            this.render();
            this.updateStatistics();
            this.showConflicts([]);
        });
    }

    loadSampleEvents() {
        const today = new Date();

        this.events = [
            {
                id: this.eventIdCounter++,
                title: 'Quarterly Review',
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 0),
                location: 'Conference Room A',
                attendees: [
                    { name: 'John Smith', email: 'john@company.com', responseStatus: 'accepted' },
                    { name: 'Jane Doe', email: 'jane@company.com', responseStatus: 'tentative' }
                ],
                reminders: [{ method: 'email', minutesBefore: 15 }],
                categories: ['meeting', 'important']
            },
            {
                id: this.eventIdCounter++,
                title: 'Daily Standup',
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
                recurring: true,
                attendees: [{ name: 'Dev Team', email: 'dev@company.com' }],
                categories: ['recurring']
            },
            {
                id: this.eventIdCounter++,
                title: 'Product Workshop',
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0),
                location: 'Conference Room A',
                categories: ['workshop']
            },
            {
                id: this.eventIdCounter++,
                title: 'Client Presentation',
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17, 0),
                location: 'Conference Room A',
                categories: ['client']
            },
            {
                id: this.eventIdCounter++,
                title: 'Training Session',
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 13, 0),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 15, 0),
                attendees: [{ name: 'All Staff', email: 'all@company.com' }],
                categories: ['training']
            }
        ];

        // Add some events to other months
        for (let i = -10; i <= 10; i++) {
            if (i % 3 === 0) {
                this.events.push({
                    id: this.eventIdCounter++,
                    title: `Meeting ${Math.abs(i)}`,
                    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + i, 14, 0),
                    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + i, 15, 0),
                    categories: ['meeting']
                });
            }
        }
    }

    addRandomEvent() {
        const titles = ['Strategy Meeting', 'Code Review', 'Customer Call', 'Team Lunch'];
        const today = new Date();
        const daysOffset = Math.floor(Math.random() * 14) - 7;
        const hour = 9 + Math.floor(Math.random() * 8);

        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysOffset, hour, 0);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);

        this.events.push({
            id: this.eventIdCounter++,
            title: titles[Math.floor(Math.random() * titles.length)],
            start: start,
            end: end,
            categories: ['generated']
        });

        this.render();
        this.updateStatistics();
        this.detectConflicts();
    }

    detectConflicts() {
        const conflicts = [];

        // Simple conflict detection
        for (let i = 0; i < this.events.length; i++) {
            for (let j = i + 1; j < this.events.length; j++) {
                const e1 = this.events[i];
                const e2 = this.events[j];

                // Check time overlap
                if (e1.start < e2.end && e2.start < e1.end) {
                    // Check if same location
                    if (e1.location && e2.location && e1.location === e2.location) {
                        conflicts.push({
                            type: 'location',
                            description: `${e1.title} and ${e2.title} both in ${e1.location}`,
                            severity: 'high'
                        });
                    } else {
                        conflicts.push({
                            type: 'time',
                            description: `${e1.title} overlaps with ${e2.title}`,
                            severity: 'medium'
                        });
                    }
                }
            }
        }

        this.showConflicts(conflicts);
    }

    showConflicts(conflicts) {
        const container = document.getElementById('conflictInfo');

        if (conflicts.length === 0) {
            container.innerHTML = '<p class="muted">No conflicts detected</p>';
            return;
        }

        container.innerHTML = conflicts.map(c => `
            <div class="conflict-item">
                <div class="conflict-type">${c.type}</div>
                <div class="conflict-description">${c.description}</div>
                <span class="conflict-severity severity-${c.severity}">${c.severity}</span>
            </div>
        `).join('');
    }

    updateStatistics() {
        document.getElementById('totalEvents').textContent = this.events.length;

        const withAttendees = this.events.filter(e => e.attendees && e.attendees.length > 0).length;
        document.getElementById('attendeeEvents').textContent = withAttendees;

        // Mock cache hit rate
        const hitRate = Math.round(70 + Math.random() * 25);
        document.getElementById('cacheHitRate').textContent = hitRate + '%';
    }

    render() {
        const container = document.getElementById('calendar');

        switch (this.currentView) {
            case 'month':
                this.renderMonth(container);
                break;
            case 'week':
                this.renderWeek(container);
                break;
            case 'day':
                this.renderDay(container);
                break;
            case 'list':
                this.renderList(container);
                break;
        }

        // Add event click handlers
        container.querySelectorAll('.calendar-event').forEach(el => {
            el.addEventListener('click', () => {
                const eventId = parseInt(el.dataset.eventId);
                const event = this.events.find(e => e.id === eventId);
                this.showEventDetails(event);
            });
        });
    }

    renderMonth(container) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        let html = `
            <div class="calendar-header">
                ${monthNames[month]} ${year}
            </div>
            <div class="weekday-headers">
                ${dayNames.map(d => `<div class="weekday">${d}</div>`).join('')}
            </div>
            <div class="month-days">
        `;

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day other-month"></div>';
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = this.getEventsForDate(date);

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''}">
                    <div class="day-number">${day}</div>
                    ${dayEvents.slice(0, 3).map(e => `
                        <div class="calendar-event" data-event-id="${e.id}">
                            ${e.title}
                        </div>
                    `).join('')}
                    ${dayEvents.length > 3 ? `<div class="more-events">+${dayEvents.length - 3} more</div>` : ''}
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    renderWeek(container) {
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            days.push(date);
        }

        let html = `
            <div class="calendar-header">
                Week of ${startOfWeek.toLocaleDateString()}
            </div>
            <div class="week-view">
        `;

        days.forEach(date => {
            const dayEvents = this.getEventsForDate(date);
            html += `
                <div class="week-day">
                    <h4>${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
                    ${dayEvents.map(e => `
                        <div class="calendar-event" data-event-id="${e.id}">
                            ${this.formatTime(e.start)} - ${e.title}
                        </div>
                    `).join('')}
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    renderDay(container) {
        const dayEvents = this.getEventsForDate(this.currentDate);

        let html = `
            <div class="calendar-header">
                ${this.currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div class="day-view">
        `;

        // Create hourly slots
        for (let hour = 8; hour <= 18; hour++) {
            const hourEvents = dayEvents.filter(e => e.start.getHours() === hour);
            html += `
                <div class="hour-slot">
                    <div class="hour-time">${hour}:00</div>
                    <div>
                        ${hourEvents.map(e => `
                            <div class="calendar-event" data-event-id="${e.id}">
                                ${e.title}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    renderList(container) {
        const sortedEvents = [...this.events].sort((a, b) => a.start - b.start);
        const eventsByDay = {};

        sortedEvents.forEach(event => {
            const dateKey = event.start.toDateString();
            if (!eventsByDay[dateKey]) {
                eventsByDay[dateKey] = [];
            }
            eventsByDay[dateKey].push(event);
        });

        let html = `
            <div class="calendar-header">All Events</div>
            <div class="list-view">
        `;

        Object.entries(eventsByDay).forEach(([dateKey, events]) => {
            html += `
                <div class="list-day">
                    <h4>${new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                    ${events.map(e => `
                        <div class="calendar-event list-item" data-event-id="${e.id}">
                            <span class="event-time">${this.formatTime(e.start)}</span>
                            ${e.title}
                        </div>
                    `).join('')}
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = event.start.toDateString();
            return eventDate === date.toDateString();
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    showEventDetails(event) {
        const container = document.getElementById('eventDetails');

        if (!event) {
            container.innerHTML = '<p class="muted">Click an event to view details</p>';
            return;
        }

        let html = '<div class="event-details-content">';

        html += `
            <div class="event-detail-item">
                <div class="event-detail-label">Title</div>
                <div class="event-detail-value">${event.title}</div>
            </div>
            <div class="event-detail-item">
                <div class="event-detail-label">Time</div>
                <div class="event-detail-value">${event.start.toLocaleString()}</div>
            </div>
        `;

        if (event.location) {
            html += `
                <div class="event-detail-item">
                    <div class="event-detail-label">Location</div>
                    <div class="event-detail-value">${event.location}</div>
                </div>
            `;
        }

        if (event.attendees) {
            html += `
                <div class="event-detail-item">
                    <div class="event-detail-label">Attendees</div>
                    <div class="event-detail-value">${event.attendees.map(a => a.name).join(', ')}</div>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CalendarDemo());
} else {
    new CalendarDemo();
}