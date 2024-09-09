// Variáveis globais
let gmuds = [];
let currentGmudId = null;

// Funções de utilidade
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getElementValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

function setElementValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
    }
}

function toggleVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = isVisible ? 'block' : 'none';
    }
}

// Funções de manipulação do DOM
function createCardElement(content, removeCallback) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card animate__animated animate__fadeIn';
    cardDiv.innerHTML = `
        <span>${content}</span>
        <button type="button">Remover</button>
    `;
    cardDiv.querySelector('button').addEventListener('click', () => {
        cardDiv.remove();
        removeCallback();
    });
    return cardDiv;
}

function appendCardToContainer(containerId, cardElement) {
    const container = document.getElementById(containerId);
    if (container) {
        container.appendChild(cardElement);
    }
}

function clearInputFields(inputIds) {
    inputIds.forEach(id => setElementValue(id, ''));
}

// Funções de gerenciamento de GMUD
function toggleGmudFields() {
    const gmudType = getElementValue('tipoGmud');
    toggleVisibility('camposDesenvolvimento', gmudType === 'desenvolvimento');
    toggleVisibility('camposBancoDados', gmudType === 'bancoDados');
}

function addJiraCard() {
    const cardNumber = getElementValue('cardJira');
    const responsible = getElementValue('responsavelCard');
    if (cardNumber && responsible) {
        const content = `Card: ${cardNumber} - Responsável: ${responsible}`;
        const cardElement = createCardElement(content, saveGmudData);
        appendCardToContainer('cardsJira', cardElement);
        clearInputFields(['cardJira', 'responsavelCard']);
        saveGmudData();
    }
}

function addParticipant() {
    const name = getElementValue('nomeParticipante');
    const email = getElementValue('emailParticipante');
    const phone = getElementValue('celularParticipante');
    const role = getElementValue('cargoParticipante');
    if (name && email) {
        const content = `Nome: ${name} - Email: ${email} - Celular: ${phone} - Cargo: ${role}`;
        const participantElement = createCardElement(content, saveGmudData);
        appendCardToContainer('listaParticipantes', participantElement);
        clearInputFields(['nomeParticipante', 'emailParticipante', 'celularParticipante', 'cargoParticipante']);
        saveGmudData();
    }
}

function addResponsible() {
    const name = getElementValue('nomeResponsavel');
    const email = getElementValue('emailResponsavel');
    const phone = getElementValue('celularResponsavel');
    const role = getElementValue('cargoResponsavel');
    if (name && email) {
        const content = `Nome: ${name} - Email: ${email} - Celular: ${phone} - Cargo: ${role}`;
        const responsibleElement = createCardElement(content, saveGmudData);
        appendCardToContainer('listaResponsaveis', responsibleElement);
        clearInputFields(['nomeResponsavel', 'emailResponsavel', 'celularResponsavel', 'cargoResponsavel']);
        saveGmudData();
    }
}

function saveGmudData() {
    const form = document.getElementById('gmudForm');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.cardsJira = getCardContents('cardsJira');
    data.participantes = getCardContents('listaParticipantes');
    data.responsaveis = getCardContents('listaResponsaveis');

    saveCheckboxGroupValues(data);
    saveAdditionalFieldValues(data);

    if (currentGmudId) {
        updateExistingGmud(data);
    } else {
        createNewGmud(data);
    }

    localStorage.setItem('gmuds', JSON.stringify(gmuds));
    updateGmudList();
}

function getCardContents(containerId) {
    const container = document.getElementById(containerId);
    return container ? Array.from(container.children).map(card =>
        card.querySelector('span').textContent.trim()
    ) : [];
}

function saveCheckboxGroupValues(data) {
    const checkboxGroups = ['feature', 'intuito', 'planoacao', 'implementacao', 'rollback', 'planoAcaoBD', 'rollbackBD', 'testes', 'comunicacao'];
    checkboxGroups.forEach(group => {
        data[group] = Array.from(document.querySelectorAll(`input[name="${group}"]:checked`)).map(cb => cb.value);
    });
}

function saveAdditionalFieldValues(data) {
    const additionalFields = ['tipoGmud', 'dataExecucao', 'horaExecucao', 'impacto', 'outrasFeatures', 'outrosIntuitos', 'detalhesPlanoAcao', 'detalhesImplementacao', 'detalhesRollback', 'scriptAlter', 'scriptRollback', 'executorScript', 'autorizador', 'detalhesPlanoAcaoBD', 'detalhesRollbackBD', 'detalhesTestes', 'detalhesComunicacao'];
    additionalFields.forEach(field => {
        data[field] = getElementValue(field);
    });
}

function updateExistingGmud(data) {
    const index = gmuds.findIndex(gmud => gmud.id === currentGmudId);
    if (index !== -1) {
        gmuds[index] = { id: currentGmudId, ...data };
    }
}

function createNewGmud(data) {
    const newGmud = { id: generateUniqueId(), ...data };
    gmuds.push(newGmud);
    currentGmudId = newGmud.id;
}

function loadGmudData(gmudId) {
    const gmud = gmuds.find(g => g.id === gmudId);
    if (gmud) {
        currentGmudId = gmud.id;
        fillFormFields(gmud);
        restoreCheckboxValues(gmud);
        restoreCards('cardsJira', gmud.cardsJira);
        restoreCards('listaParticipantes', gmud.participantes);
        restoreCards('listaResponsaveis', gmud.responsaveis);
        toggleGmudFields();
    }
}

function fillFormFields(gmud) {
    Object.keys(gmud).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = Array.isArray(gmud[key]) && gmud[key].includes(element.value);
            } else if (element.type === 'select-one') {
                element.value = gmud[key] || '';
            } else {
                element.value = gmud[key] || '';
            }
        }
    });
}

function restoreCheckboxValues(gmud) {
    const checkboxGroups = ['feature', 'intuito', 'planoacao', 'implementacao', 'rollback', 'planoAcaoBD', 'rollbackBD', 'testes', 'comunicacao'];
    checkboxGroups.forEach(group => {
        if (Array.isArray(gmud[group])) {
            document.querySelectorAll(`input[name="${group}"]`).forEach(checkbox => {
                checkbox.checked = gmud[group].includes(checkbox.value);
            });
        }
    });
}

function restoreCards(containerId, cards) {
    const container = document.getElementById(containerId);
    if (container && Array.isArray(cards)) {
        container.innerHTML = '';
        cards.forEach(card => {
            const cardElement = createCardElement(card, saveGmudData);
            container.appendChild(cardElement);
        });
    }
}

function clearGmudForm() {
    const form = document.getElementById('gmudForm');
    if (form) {
        form.reset();
        ['cardsJira', 'listaParticipantes', 'listaResponsaveis'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = '';
        });
        currentGmudId = null;
        toggleGmudFields();
    }
}

function updateGmudList() {
    const listElement = document.getElementById('savedGmudsList');
    if (listElement) {
        listElement.innerHTML = '';
        gmuds.forEach(gmud => {
            const listItem = createGmudListItem(gmud);
            listElement.appendChild(listItem);
        });
    }
}

function createGmudListItem(gmud) {
    const li = document.createElement('li');
    const formattedDate = formatGmudDate(gmud.id);
    li.innerHTML = `
        GMUD ${gmud.tipoGmud} - ${formattedDate}
        <button onclick="editGmud('${gmud.id}')">Editar</button>
        <button onclick="deleteGmud('${gmud.id}')">Excluir</button>
    `;
    return li;
}

function formatGmudDate(gmudId) {
    const timestamp = parseInt(gmudId.split('-')[0], 36);
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function editGmud(gmudId) {
    showLoader();
    setTimeout(() => {
        loadGmudData(gmudId);
        hideLoader();
    }, 1000);
}

function deleteGmud(gmudId) {
    gmuds = gmuds.filter(gmud => gmud.id !== gmudId);
    localStorage.setItem('gmuds', JSON.stringify(gmuds));
    updateGmudList();
    if (currentGmudId === gmudId) {
        clearGmudForm();
    }
}

function generateGmudDocument() {
    const printArea = document.getElementById('printArea');
    if (!printArea) {
        console.error("Elemento 'printArea' não encontrado");
        return;
    }

    let content = `
        <div id="footer">AmorSaúde GMUD</div>
        <div class="watermark">AmorSaúde</div>
        <div id="content">
    `;

    content += generateGeneralInformation();
    content += generateGmudDetails();
    content += generateRollbackPlan();
    content += generateTestingAndValidation();
    content += generateCommunicationPlan();
    content += generateParticipantsOrResponsibles();
    content += generateApprovals();

    content += '</div>'; // Closing #content div

    printArea.innerHTML = content;
    window.print();
}

function generateGeneralInformation() {
    const gmudType = getElementValue('tipoGmud');
    const executionDate = getElementValue('dataExecucao');
    const executionTime = getElementValue('horaExecucao');
    const impact = getElementValue('impacto');

    return `
        <div class="section">
            <h2>1. INFORMAÇÕES GERAIS</h2>
            <table>
                <tr><th>Tipo de GMUD</th><td>${gmudType}</td></tr>
                <tr><th>Data de Execução</th><td>${executionDate}</td></tr>
                <tr><th>Hora de Execução</th><td>${executionTime}</td></tr>
                <tr><th>Impacto da Mudança</th><td>${impact}</td></tr>
            </table>
        </div>
    `;
}

function generateGmudDetails() {
    const gmudType = getElementValue('tipoGmud');
    let content = '<div class="section"><h2>2. DETALHES DA GMUD</h2>';

    if (gmudType === 'desenvolvimento') {
        content += generateDevelopmentDetails();
    } else if (gmudType === 'bancoDados') {
        content += generateDatabaseDetails();
    } else {
        content += '<p>Tipo de GMUD não especificado ou inválido.</p>';
    }

    content += '</div>';
    return content;
}

function generateDevelopmentDetails() {
    let content = '';
    content += generateJiraCards();
    content += generateFeatures();
    content += generateChangeIntent();
    content += generateActionPlan();
    content += generateImplementation();
    return content;
}

function generateDatabaseDetails() {
    let content = '';
    content += generateAlterScript();
    content += generateRollbackScript();
    content += generateResponsibilities();
    content += generateDatabaseActionPlan();
    return content;
}

function generateJiraCards() {
    const cards = getCardContents('cardsJira');
    if (cards.length === 0) return '';

    let content = '<h3>2.1 Cards do Jira</h3><ul>';
    cards.forEach(card => {
        content += `<li>${card}</li>`;
    });
    content += '</ul>';
    return content;
}

function generateFeatures() {
    let content = '<h3>2.2 Features</h3><ul>';
    document.querySelectorAll('input[name="feature"]:checked').forEach(feature => {
        content += `<li>${feature.parentNode.textContent.trim()}</li>`;
    });
    const otherFeatures = getElementValue('outrasFeatures');
    if (otherFeatures) {
        content += `<li>Outras: ${otherFeatures}</li>`;
    }
    content += '</ul>';
    return content;
}

function generateChangeIntent() {
    let content = '<h3>2.3 Intuito da Alteração</h3><ul>';
    const intuitoCheckboxes = document.querySelectorAll('input[name="intuito"]:checked');
    if (intuitoCheckboxes.length > 0) {
        intuitoCheckboxes.forEach(intent => {
            content += `<li>${intent.parentNode.textContent.trim()}</li>`;
        });
    } else {
        content += '<li>Nenhum intuito selecionado</li>';
    }
    const otherIntents = getElementValue('outrosIntuitos');
    if (otherIntents) {
        content += `<li>Outros: ${otherIntents}</li>`;
    }
    content += '</ul>';
    return content;
}

function generateActionPlan() {
    let content = '<h3>2.4 Plano de Ação</h3><ul>';
    document.querySelectorAll('input[name="planoacao"]:checked').forEach(plan => {
        content += `<li>${plan.parentNode.textContent.trim()}</li>`;
    });
    const actionDetails = getElementValue('detalhesPlanoAcao');
    if (actionDetails) {
        content += `<li>Detalhes: ${actionDetails}</li>`;
    }
    content += '</ul>';
    return content;
}

function generateImplementation() {
    let content = '<h3>2.5 Implementação</h3><ul>';
    document.querySelectorAll('input[name="implementacao"]:checked').forEach(impl => {
        content += `<li>${impl.parentNode.textContent.trim()}</li>`;
    });
    const implementationDetails = getElementValue('detalhesImplementacao');
    if (implementationDetails) {
        content += `<li>Detalhes: ${implementationDetails}</li>`;
    }
    content += '</ul>';
    return content;
}

function generateAlterScript() {
    const script = getElementValue('scriptAlter');
    if (!script) return '';
    return `<h3>2.1 Script de Alteração</h3><pre>${script}</pre>`;
}

function generateRollbackScript() {
    const script = getElementValue('scriptRollback');
    if (!script) return '';
    return `<h3>2.2 Script de Rollback</h3><pre>${script}</pre>`;
}

function generateResponsibilities() {
    const executor = getElementValue('executorScript');
    const authorizer = getElementValue('autorizador');
    return `
        <h3>2.3 Responsabilidades</h3>
        <table>
            <tr><th>Executor do Script</th><td>${executor}</td></tr>
            <tr><th>Autorizador</th><td>${authorizer}</td></tr>
        </table>
    `;
}

function generateDatabaseActionPlan() {
    let content = '<h3>2.4 Plano de Ação</h3><ul>';
    document.querySelectorAll('input[name="planoAcaoBD"]:checked').forEach(plan => {
        content += `<li>${plan.parentNode.textContent.trim()}</li>`;
    });
    const actionDetails = getElementValue('detalhesPlanoAcaoBD');
    if (actionDetails) {
        content += `<li>Detalhes: ${actionDetails}</li>`;
    }
    content += '</ul>';
    return content;
}

function generateRollbackPlan() {
    const gmudType = getElementValue('tipoGmud');
    const rollbackSelector = gmudType === 'desenvolvimento' ? 'input[name="rollback"]:checked' : 'input[name="rollbackBD"]:checked';
    const detailsId = gmudType === 'desenvolvimento' ? 'detalhesRollback' : 'detalhesRollbackBD';

    let content = `
        <div class="section">
            <h2>3. PLANO DE ROLLBACK</h2>
            <ul>
    `;
    document.querySelectorAll(rollbackSelector).forEach(rollback => {
        content += `<li>${rollback.parentNode.textContent.trim()}</li>`;
    });
    const rollbackDetails = getElementValue(detailsId);
    if (rollbackDetails) {
        content += `<li>Detalhes: ${rollbackDetails}</li>`;
    }
    content += '</ul></div>';
    return content;
}

function generateTestingAndValidation() {
    let content = `
        <div class="section">
            <h2>4. TESTES E VALIDAÇÃO</h2>
            <h3>4.1 Testes Prévios Realizados</h3>
            <ul>
    `;
    document.querySelectorAll('input[name="testes"]:checked').forEach(test => {
        content += `<li>${test.parentNode.textContent.trim()}</li>`;
    });
    const testDetails = getElementValue('detalhesTestes');
    if (testDetails) {
        content += `<li>Detalhes: ${testDetails}</li>`;
    }
    content += '</ul></div>';
    return content;
}

function generateCommunicationPlan() {
    let content = `
        <div class="section">
            <h2>5. COMUNICAÇÃO</h2>
            <h3>5.1 Comunicação aos Stakeholders</h3>
            <ul>
    `;
    document.querySelectorAll('input[name="comunicacao"]:checked').forEach(comm => {
        content += `<li>${comm.parentNode.textContent.trim()}</li>`;
    });
    const communicationDetails = getElementValue('detalhesComunicacao');
    if (communicationDetails) {
        content += `<li>Detalhes: ${communicationDetails}</li>`;
    }
    content += '</ul></div>';
    return content;
}

function generateParticipantsOrResponsibles() {
    const gmudType = getElementValue('tipoGmud');
    const listId = gmudType === 'desenvolvimento' ? 'listaParticipantes' : 'listaResponsaveis';
    const participants = getCardContents(listId);
    if (participants.length === 0) return '';

    let content = `
        <div class="section">
            <h2>6. ${gmudType === 'desenvolvimento' ? 'PARTICIPANTES' : 'RESPONSÁVEIS'}</h2>
            <ul>
    `;
    participants.forEach(p => {
        content += `<li>${p}</li>`;
    });
    content += '</ul></div>';
    return content;
}

function generateApprovals() {
    return `
        <div class="section">
            <h2>7. APROVAÇÕES</h2>
            <div style="display: flex; justify-content: space-between;">
                <div class="signature-line">Solicitante</div>
                <div class="signature-line">Aprovador</div>
            </div>
        </div>
    `;
}

function showLoader() {
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'loader-container';
    const loader = document.createElement('div');
    loader.className = 'loader';
    loaderContainer.appendChild(loader);
    document.body.appendChild(loaderContainer);
}

function hideLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        loaderContainer.style.opacity = '0';
        setTimeout(() => {
            loaderContainer.remove();
        }, 500);
    }
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeGmudSystem();
    setupEventListeners();
});

function initializeGmudSystem() {
    const savedGmuds = localStorage.getItem('gmuds');
    if (savedGmuds) {
        gmuds = JSON.parse(savedGmuds);
        updateGmudList();
    }
}

function setupEventListeners() {
    const tipoGmudElement = document.getElementById('tipoGmud');
    if (tipoGmudElement) {
        tipoGmudElement.addEventListener('change', () => {
            toggleGmudFields();
            saveGmudData();
        });
    }

    document.querySelectorAll('#gmudForm input, #gmudForm select, #gmudForm textarea').forEach(element => {
        element.addEventListener('change', saveGmudData);
    });

    document.getElementById('gmudForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveGmudData();
    });

    // Atualizar para usar addEventListener em vez de onclick
    document.querySelector('button[data-action="addJiraCard"]')?.addEventListener('click', addJiraCard);
    document.querySelector('button[data-action="addParticipant"]')?.addEventListener('click', addParticipant);
    document.querySelector('button[data-action="addResponsible"]')?.addEventListener('click', addResponsible);
    document.querySelector('button[data-action="clearGmudForm"]')?.addEventListener('click', clearGmudForm);
    document.querySelector('button[data-action="generateGmudDocument"]')?.addEventListener('click', generateGmudDocument);
}