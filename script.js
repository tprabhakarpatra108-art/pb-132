import data from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderSkills();
    renderExperience();
    renderEducation();
    renderProjects();
    renderCertifications();
});

function renderHeader() {
    document.getElementById('name').textContent = data.personalInfo.name;
    document.getElementById('role').textContent = data.personalInfo.role;

    const contactContainer = document.getElementById('contact-info');
    const contacts = [
        { icon: 'fas fa-map-marker-alt', text: data.personalInfo.location },
        { icon: 'fas fa-envelope', text: 'Email', href: `mailto:${data.personalInfo.email}` },
        { icon: 'fab fa-linkedin', text: 'LinkedIn', href: data.personalInfo.linkedin }
    ];

    contacts.forEach(c => {
        const a = document.createElement('a');
        a.className = 'contact-item';
        if (c.href) a.href = c.href;
        a.innerHTML = `<i class="${c.icon}"></i> ${c.text}`;
        contactContainer.appendChild(a);
    });
}

function renderSkills() {
    const techContainer = document.getElementById('tech-skills');
    data.skills.technical.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = skill;
        techContainer.appendChild(span);
    });

    const miscContainer = document.getElementById('misc-skills');
    [...data.languages, ...data.interests].forEach(item => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.style.backgroundColor = '#f8f9fa';
        span.style.color = '#7f8c8d';
        span.textContent = item;
        miscContainer.appendChild(span);
    });
}

function renderExperience() {
    document.getElementById('summary').textContent = data.summary;

    const container = document.getElementById('experience-list');
    data.experience.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'exp-item';
        div.innerHTML = `
            <div class="exp-header">
                <span class="exp-role">${exp.role}</span>
            </div>
            <span class="exp-org">${exp.organization}</span>
            <p class="exp-desc">${exp.description}</p>
        `;
        container.appendChild(div);
    });
}

function renderEducation() {
    const container = document.getElementById('education-list');
    data.education.forEach(edu => {
        const div = document.createElement('div');
        div.className = 'edu-item';
        div.innerHTML = `
            <div class="exp-header">
                <span class="exp-role">${edu.degree}</span>
                <span class="exp-date">${edu.period}</span>
            </div>
            <span class="exp-org">${edu.institution}</span>
            <span class="exp-date">${edu.location}</span>
        `;
        container.appendChild(div);
    });
}

function renderProjects() {
    const container = document.getElementById('project-list');
    data.projects.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <div class="exp-header">
                <span class="exp-role">${proj.name}</span>
            </div>
            <div class="skill-tags" style="margin: 0.5rem 0;">
                ${proj.technologies.slice(0, 3).map(tech => `<span class="tag" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">${tech}</span>`).join('')}
            </div>
            <p class="exp-desc" style="font-size: 0.85rem;">${proj.details}</p>
        `;
        container.appendChild(div);
    });
}

function renderCertifications() {
    const container = document.getElementById('certifications');
    data.certifications.forEach(cert => {
        const li = document.createElement('li');
        li.textContent = cert;
        container.appendChild(li);
    });
}

// Chatbot Logic
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatWindow = document.getElementById('chat-window');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatMessages = document.getElementById('chat-messages');

function toggleChat() {
    chatWindow.classList.toggle('active');
}

chatToggleBtn.addEventListener('click', toggleChat);
chatCloseBtn.addEventListener('click', toggleChat);

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add User Message
    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator (optional, simplified here)
    // const loadingMsg = addMessage("Typing...", 'bot');

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            addMessage("Sorry, I encountered an error.", 'bot');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage("Sorry, I couldn't connect to the server.", 'bot');
    }
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

chatSendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
