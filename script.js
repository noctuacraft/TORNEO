// Estado del torneo
let tournamentState = {
    players: [],
    drawCompleted: false,
    leagueMatches: [],
    standings: [],
    playoffs: {
        semifinals: [],
        final: null
    },
    champion: null,
    currentMatch: null
};

// Jugadores iniciales con URLs de imágenes de perfil
const initialPlayers = [
    { 
        id: 1, 
        name: "Thiago Santamarina", 
        number: null,
        avatar: "img/Thiago.jpg",
        country: "Argentina",
        style: "Estratégico"
    },
    { 
        id: 2, 
        name: "Gonzalo Campos", 
        number: null,
        avatar: "img/Gonzalo.jpg",
        country: "Argentina", 
        style: "Ofensivo"
    },
    { 
        id: 3, 
        name: "Joaquin Riedel", 
        number: null,
        avatar: "img/Joaquin.jpg",
        country: "Argentina",
        style: "Veloz"
    },
    { 
        id: 4, 
        name: "Augusto Turner", 
        number: null,
        avatar: "img/Augusto.jpg",
        country: "Argentina",
        style: "Preciso"
    },
    { 
        id: 5, 
        name: "Melody Bosio", 
        number: null,
        avatar: "img/Melody.jpg",
        country: "Argentina",
        style: "Técnico"
    },
    { 
        id: 6, 
        name: "Zoe Billar", 
        number: null,
        avatar: "img/Zoe.jpg",
        country: "Argentina",
        style: "Defensivo"
    },
    { 
        id: 7, 
        name: "Vienni", 
        number: null,
        avatar: "img/vienni.jpg",
        country: "Argentina",
        style: "Potente"
    }
];

// Inicialización
function initializeTournament() {
    tournamentState.players = JSON.parse(JSON.stringify(initialPlayers));
    tournamentState.drawCompleted = false;
    tournamentState.leagueMatches = [];
    tournamentState.standings = [];
    tournamentState.playoffs.semifinals = [];
    tournamentState.playoffs.final = null;
    tournamentState.champion = null;
    tournamentState.currentMatch = null;
    
    initializeDrawScreen();
    updateEVAMessage("¡Hola! Soy E.V.A. Estoy lista para el torneo. Comienza con el sorteo.");
}

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('start-draw-btn').addEventListener('click', performDraw);
    document.getElementById('back-to-draw-btn').addEventListener('click', showDrawScreen);
    document.getElementById('start-playoffs-btn').addEventListener('click', startPlayoffs);
    document.getElementById('back-to-league-btn').addEventListener('click', showLeagueScreen);
    document.getElementById('view-results-btn').addEventListener('click', showResultsScreen);
    document.getElementById('back-to-playoffs-btn').addEventListener('click', showPlayoffsScreen);
    document.getElementById('new-tournament-btn').addEventListener('click', newTournament);
    
    // Modal events
    document.getElementById('modal-close').addEventListener('click', closeMatchModal);
    document.getElementById('save-match-btn').addEventListener('click', saveMatchResult);
}

// Pantalla de Sorteo
function initializeDrawScreen() {
    const playersDrawContainer = document.getElementById('players-draw');
    playersDrawContainer.innerHTML = '';
    
    tournamentState.players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-draw-card';
        playerCard.innerHTML = `
            <div class="player-avatar">
                <img src="${player.avatar}" alt="${player.name}" onerror="this.src='https://via.placeholder.com/150/007bff/ffffff?text=?'">
            </div>
            <div class="player-number">${player.number ? player.number : '?'}</div>
            <div class="player-name">${player.name}</div>
            <div class="player-style">${player.style}</div>
        `;
        
        playersDrawContainer.appendChild(playerCard);
    });
}

function performDraw() {
    // Mezclar números del 1 al 7
    const numbers = [1, 2, 3, 4, 5, 6, 7];
    const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
    
    // Asignar números a jugadores
    tournamentState.players.forEach((player, index) => {
        player.number = shuffledNumbers[index];
    });
    
    tournamentState.drawCompleted = true;
    
    // Actualizar visualización
    updateDrawDisplay();
    
    // Habilitar botón para continuar
    document.getElementById('start-draw-btn').disabled = true;
    
    // Mostrar mensaje de E.V.A.
    updateEVAMessage("¡Sorteo completado! Cada jugador tiene su número. Preparando fase de liga...");
    
    // Mostrar pantalla de liga después de un breve delay
    setTimeout(() => {
        startLeaguePhase();
    }, 2000);
}

function updateDrawDisplay() {
    const playerCards = document.querySelectorAll('.player-draw-card');
    
    playerCards.forEach((card, index) => {
        const player = tournamentState.players[index];
        card.classList.add('assigned');
        card.querySelector('.player-number').textContent = player.number;
        
        // Animación de aparición
        card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
    });
}

function startLeaguePhase() {
    generateLeagueMatches();
    showLeagueScreen();
    updateEVAMessage("Fase de liga iniciada. ¡Todos contra todos! Registra los resultados de los partidos.");
}

function generateLeagueMatches() {
    tournamentState.leagueMatches = [];
    
    // ORDEN ESPECÍFICO DE PARTIDOS PROPORCIONADO
    const matchOrder = [
        { player1Num: 2, player2Num: 7 },  // 1. 2 vs 7
        { player1Num: 3, player2Num: 6 },  // 2. 3 vs 6
        { player1Num: 4, player2Num: 5 },  // 3. 4 vs 5
        { player1Num: 1, player2Num: 7 },  // 4. 1 vs 7
        { player1Num: 2, player2Num: 5 },  // 5. 2 vs 5
        { player1Num: 3, player2Num: 4 },  // 6. 3 vs 4
        { player1Num: 1, player2Num: 6 },  // 7. 1 vs 6
        { player1Num: 7, player2Num: 5 },  // 8. 7 vs 5
        { player1Num: 2, player2Num: 3 },  // 9. 2 vs 3
        { player1Num: 1, player2Num: 5 },  // 10. 1 vs 5
        { player1Num: 6, player2Num: 4 },  // 11. 6 vs 4
        { player1Num: 7, player2Num: 3 },  // 12. 7 vs 3
        { player1Num: 1, player2Num: 4 },  // 13. 1 vs 4
        { player1Num: 5, player2Num: 3 },  // 14. 5 vs 3
        { player1Num: 6, player2Num: 2 },  // 15. 6 vs 2
        { player1Num: 1, player2Num: 3 },  // 16. 1 vs 3
        { player1Num: 4, player2Num: 2 },  // 17. 4 vs 2
        { player1Num: 6, player2Num: 7 },  // 18. 6 vs 7
        { player1Num: 1, player2Num: 2 },  // 19. 1 vs 2
        { player1Num: 4, player2Num: 7 },  // 20. 4 vs 7
        { player1Num: 5, player2Num: 6 }   // 21. 5 vs 6
    ];
    
    // Crear partidos en el orden específico
    matchOrder.forEach((matchPair, index) => {
        const player1 = tournamentState.players.find(p => p.number === matchPair.player1Num);
        const player2 = tournamentState.players.find(p => p.number === matchPair.player2Num);
        
        if (player1 && player2) {
            tournamentState.leagueMatches.push({
                id: `match_${index + 1}`,
                player1: player1,
                player2: player2,
                score1: null,
                score2: null,
                winner: null,
                completed: false,
                round: Math.ceil((index + 1) / 3) // Agrupar en rondas de 3 partidos
            });
        }
    });
    
    updateStandings();
    updateLeagueDisplay();
}

function updateStandings() {
    // Inicializar estadísticas de jugadores
    tournamentState.players.forEach(player => {
        player.matchesPlayed = 0;
        player.matchesWon = 0;
        player.matchesLost = 0;
        player.points = 0;
        player.setsWon = 0;
        player.setsLost = 0;
        player.setDifference = 0;
    });
    
    // Calcular estadísticas basadas en partidos completados
    tournamentState.leagueMatches.forEach(match => {
        if (match.completed) {
            const player1 = tournamentState.players.find(p => p.id === match.player1.id);
            const player2 = tournamentState.players.find(p => p.id === match.player2.id);
            
            if (player1 && player2) {
                player1.matchesPlayed++;
                player2.matchesPlayed++;
                
                // Contar sets
                player1.setsWon += match.score1;
                player1.setsLost += match.score2;
                player2.setsWon += match.score2;
                player2.setsLost += match.score1;
                
                // Calcular diferencia de sets
                player1.setDifference = player1.setsWon - player1.setsLost;
                player2.setDifference = player2.setsWon - player2.setsLost;
                
                if (match.winner && match.winner.id === player1.id) {
                    player1.matchesWon++;
                    player1.points += 3;
                    player2.matchesLost++;
                } else if (match.winner && match.winner.id === player2.id) {
                    player2.matchesWon++;
                    player2.points += 3;
                    player1.matchesLost++;
                }
            }
        }
    });
    
    // Ordenar por puntos (y desempates REALES)
    tournamentState.standings = [...tournamentState.players].sort((a, b) => {
        // 1. Puntos
        if (b.points !== a.points) return b.points - a.points;
        
        // 2. Diferencia de sets
        const aSetDiff = a.setsWon - a.setsLost;
        const bSetDiff = b.setsWon - b.setsLost;
        if (bSetDiff !== aSetDiff) return bSetDiff - aSetDiff;
        
        // 3. Sets a favor
        if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
        
        // 4. Número de sorteo (desempate final)
        return a.number - b.number;
    });
}

function updateLeagueDisplay() {
    updateStandingsTable();
    updateLeagueMatches();
    checkLeagueCompletion();
}

function updateStandingsTable() {
    const standingsBody = document.getElementById('standings-body');
    standingsBody.innerHTML = '';
    
    tournamentState.standings.forEach((player, index) => {
        const setDifference = (player.setsWon || 0) - (player.setsLost || 0);
        const setDiffDisplay = setDifference > 0 ? `+${setDifference}` : setDifference;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="player-avatar-small">
                        <img src="${player.avatar}" alt="${player.name}" onerror="this.src='https://via.placeholder.com/40/007bff/ffffff?text=?'">
                    </div>
                    ${player.name} (#${player.number})
                </div>
            </td>
            <td>${player.matchesPlayed || 0}</td>
            <td>${player.matchesWon || 0}</td>
            <td>${player.matchesLost || 0}</td>
            <td>${player.setsWon || 0}-${player.setsLost || 0} (${setDiffDisplay})</td>
            <td><strong>${player.points || 0}</strong></td>
        `;
        
        // Resaltar los primeros 4 puestos que clasifican a semifinales
        if (index < 4) {
            row.classList.add('qualifying-position');
        }
        
        standingsBody.appendChild(row);
    });
}

function updateLeagueMatches() {
    const matchesContainer = document.getElementById('league-matches');
    matchesContainer.innerHTML = '';
    
    // Agrupar partidos por rondas (cada 3 partidos)
    const rounds = [];
    for (let i = 0; i < tournamentState.leagueMatches.length; i += 3) {
        rounds.push(tournamentState.leagueMatches.slice(i, i + 3));
    }
    
    rounds.forEach((roundMatches, roundIndex) => {
        const roundHeader = document.createElement('div');
        roundHeader.className = 'round-header';
        roundHeader.innerHTML = `<h3>Ronda ${roundIndex + 1}</h3>`;
        matchesContainer.appendChild(roundHeader);
        
        roundMatches.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = `match-card ${match.completed ? 'completed' : ''}`;
            matchCard.dataset.matchId = match.id;
            
            const player1Class = match.completed && match.winner && match.winner.id === match.player1.id ? 'winner' : '';
            const player2Class = match.completed && match.winner && match.winner.id === match.player2.id ? 'winner' : '';
            
            matchCard.innerHTML = `
                <div class="match-players">
                    <div class="match-player ${player1Class}">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <div class="player-avatar-small">
                                <img src="${match.player1.avatar}" alt="${match.player1.name}" onerror="this.src='https://via.placeholder.com/30/007bff/ffffff?text=?'">
                            </div>
                            ${match.player1.name} (#${match.player1.number})
                        </div>
                    </div>
                    <div class="match-vs">VS</div>
                    <div class="match-player ${player2Class}">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <div class="player-avatar-small">
                                <img src="${match.player2.avatar}" alt="${match.player2.name}" onerror="this.src='https://via.placeholder.com/30/007bff/ffffff?text=?'">
                            </div>
                            ${match.player2.name} (#${match.player2.number})
                        </div>
                    </div>
                </div>
                ${match.completed ? `
                    <div class="match-score">
                        <span>${match.score1}</span>
                        <span>-</span>
                        <span>${match.score2}</span>
                    </div>
                    <div class="match-status completed">
                        ${match.winner ? `Ganó: ${match.winner.name}` : 'Empate'}
                    </div>
                ` : `
                    <div class="match-status">
                        Pendiente
                    </div>
                `}
            `;
            
            matchCard.addEventListener('click', () => openMatchModal(match));
            matchesContainer.appendChild(matchCard);
        });
    });
}

function checkLeagueCompletion() {
    const completedMatches = tournamentState.leagueMatches.filter(match => match.completed).length;
    const totalMatches = tournamentState.leagueMatches.length;
    const allMatchesCompleted = completedMatches === totalMatches;
    
    const startPlayoffsBtn = document.getElementById('start-playoffs-btn');
    startPlayoffsBtn.disabled = !allMatchesCompleted;
    
    if (allMatchesCompleted) {
        startPlayoffsBtn.innerHTML = '<i class="fas fa-trophy"></i> Iniciar Semifinales';
        
        // Mostrar quiénes clasifican a semifinales
        const qualifiers = tournamentState.standings.slice(0, 4);
        const qualifierNames = qualifiers.map(q => q.name).join(', ');
        
        updateEVAMessage(`¡Fase de liga completada! Clasifican a semifinales: ${qualifierNames}`);
    }
}

// Modal de partidos
function openMatchModal(match) {
    tournamentState.currentMatch = match;
    
    // Determinar el título según el tipo de partido
    let title = 'Registrar Resultado';
    if (match.round === 'semifinal') title = 'Semifinal - Registrar Resultado';
    if (match.round === 'final') title = 'FINAL - Registrar Resultado';
    
    document.getElementById('match-modal-title').textContent = title;
    
    // Actualizar nombres con avatares
    const matchPlayers = document.getElementById('match-players');
    matchPlayers.innerHTML = `
        <div class="match-player-modal">
            <div class="player-avatar-medium">
                <img src="${match.player1.avatar}" alt="${match.player1.name}" onerror="this.src='https://via.placeholder.com/80/007bff/ffffff?text=?'">
            </div>
            <div class="player-name">${match.player1.name}</div>
            <div class="player-number">#${match.player1.number}</div>
        </div>
        <div class="modal-vs">VS</div>
        <div class="match-player-modal">
            <div class="player-avatar-medium">
                <img src="${match.player2.avatar}" alt="${match.player2.name}" onerror="this.src='https://via.placeholder.com/80/007bff/ffffff?text=?'">
            </div>
            <div class="player-name">${match.player2.name}</div>
            <div class="player-number">#${match.player2.number}</div>
        </div>
    `;
    
    document.getElementById('player1-score').value = match.score1 || '';
    document.getElementById('player2-score').value = match.score2 || '';
    
    document.getElementById('match-modal').classList.add('active');
}

function closeMatchModal() {
    document.getElementById('match-modal').classList.remove('active');
    tournamentState.currentMatch = null;
}

function saveMatchResult() {
    const match = tournamentState.currentMatch;
    if (!match) return;

    const score1 = parseInt(document.getElementById('player1-score').value);
    const score2 = parseInt(document.getElementById('player2-score').value);

    if (isNaN(score1) || isNaN(score2)) {
        alert('Por favor ingresa puntajes válidos para ambos jugadores');
        return;
    }

    if (score1 === score2) {
        alert('Los puntajes no pueden ser iguales. Por favor ingresa un ganador claro.');
        return;
    }

    // Actualizar el partido
    match.score1 = score1;
    match.score2 = score2;
    match.winner = score1 > score2 ? match.player1 : match.player2;
    match.completed = true;

    closeMatchModal();

    // Determinar qué actualizar según el tipo de partido
    if (match.round === 'semifinal' || match.round === 'final') {
        // Es partido de playoffs
        updatePlayoffsDisplay();
        updateEVAMessage(`¡Resultado de ${match.round} registrado! ${match.winner.name} avanza.`);
        
        // Verificar si se completó la final
        if (match.round === 'final' && match.completed) {
            tournamentState.champion = match.winner;
            createConfetti();
            setTimeout(() => {
                alert(`¡${match.winner.name} es el CAMPEÓN del torneo! 🏆`);
                showResultsScreen();
            }, 1000);
        }
    } else {
        // Es partido de liga - ACTUALIZAR ESTADÍSTICAS PRIMERO
        updateStandings(); // ¡ESTA LÍNEA FALTABA!
        updateLeagueDisplay();
        updateEVAMessage(`Resultado registrado: ${match.winner.name} gana!`);
        
        // Mostrar confetti si es el último partido de la liga
        const completedMatches = tournamentState.leagueMatches.filter(m => m.completed).length;
        const totalMatches = tournamentState.leagueMatches.length;

        if (completedMatches === totalMatches) {
            createConfetti();
            setTimeout(() => {
                // Mostrar clasificados
                const qualifiers = tournamentState.standings.slice(0, 4);
                const qualifierList = qualifiers.map((q, i) => `${i+1}°: ${q.name}`).join('\n');
                alert(`¡Fase de Liga completada! \n\nClasificados a Semifinales:\n${qualifierList}`);
            }, 1000);
        }
    }
}

// Fase de Playoffs
function startPlayoffs() {
    if (tournamentState.standings.length < 4) {
        alert('No hay suficientes jugadores para las semifinales');
        return;
    }
    
    // Asegurarnos de que las estadísticas estén actualizadas
    updateStandings();
    
    // CORREGIDO: Solo los 4 mejores clasifican a semifinales
    const top4 = tournamentState.standings.slice(0, 4);
    
    console.log("Clasificados a semifinales:", top4.map(p => `${p.name} (${p.points} pts)`));
    
    // Verificar que tenemos 4 jugadores
    if (top4.length !== 4) {
        alert('Error: No se pueden determinar los 4 clasificados');
        return;
    }
    
    // Crear semifinales: 1° vs 4° y 2° vs 3°
    const semifinal1 = {
        id: 'semifinal_1',
        player1: top4[0], // 1° puesto
        player2: top4[3], // 4° puesto
        score1: null,
        score2: null,
        winner: null,
        completed: false,
        round: 'semifinal'
    };
    
    const semifinal2 = {
        id: 'semifinal_2',
        player1: top4[1], // 2° puesto
        player2: top4[2], // 3° puesto
        score1: null,
        score2: null,
        winner: null,
        completed: false,
        round: 'semifinal'
    };
    
    tournamentState.playoffs.semifinals = [semifinal1, semifinal2];
    tournamentState.playoffs.final = null;
    tournamentState.champion = null;
    
    updatePlayoffsDisplay();
    showPlayoffsScreen();
    
    // Mostrar los emparejamientos de semifinales
    const matchup1 = `${top4[0].name} vs ${top4[3].name}`;
    const matchup2 = `${top4[1].name} vs ${top4[2].name}`;
    updateEVAMessage(`¡Semifinales iniciadas! ${matchup1} y ${matchup2}. ¡Que comience la eliminatoria!`);
}

function updatePlayoffsDisplay() {
    updateSemifinalsDisplay();
    updateFinalDisplay();
    checkPlayoffsCompletion();
}

function updateSemifinalsDisplay() {
    const semifinalsContainer = document.getElementById('semifinals-matches');
    semifinalsContainer.innerHTML = '';
    
    tournamentState.playoffs.semifinals.forEach(match => {
        const matchCard = createPlayoffMatchCard(match);
        semifinalsContainer.appendChild(matchCard);
    });
}

function updateFinalDisplay() {
    const finalContainer = document.getElementById('final-match');
    finalContainer.innerHTML = '';
    
    if (tournamentState.playoffs.final) {
        const matchCard = createPlayoffMatchCard(tournamentState.playoffs.final, true);
        finalContainer.appendChild(matchCard);
    } else {
        finalContainer.innerHTML = '<div class="playoff-match final"><div class="match-status">Finalistas por definir</div></div>';
    }
}

function createPlayoffMatchCard(match, isFinal = false) {
    const matchCard = document.createElement('div');
    matchCard.className = `playoff-match ${isFinal ? 'final' : ''} ${match.completed ? 'completed' : ''}`;
    matchCard.dataset.matchId = match.id;
    
    const player1Class = match.completed && match.winner && match.winner.id === match.player1.id ? 'winner' : '';
    const player2Class = match.completed && match.winner && match.winner.id === match.player2.id ? 'winner' : '';
    
    matchCard.innerHTML = `
        <div class="match-players">
            <div class="match-player ${player1Class}">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="player-avatar-small">
                        <img src="${match.player1.avatar}" alt="${match.player1.name}" onerror="this.src='https://via.placeholder.com/30/007bff/ffffff?text=?'">
                    </div>
                    ${match.player1.name} (#${match.player1.number})
                    ${match.completed && match.winner && match.winner.id === match.player1.id ? '👑' : ''}
                </div>
            </div>
            <div class="match-vs">VS</div>
            <div class="match-player ${player2Class}">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="player-avatar-small">
                        <img src="${match.player2.avatar}" alt="${match.player2.name}" onerror="this.src='https://via.placeholder.com/30/007bff/ffffff?text=?'">
                    </div>
                    ${match.player2.name} (#${match.player2.number})
                    ${match.completed && match.winner && match.winner.id === match.player2.id ? '👑' : ''}
                </div>
            </div>
        </div>
        ${match.completed ? `
            <div class="match-score">
                <span>${match.score1}</span>
                <span>-</span>
                <span>${match.score2}</span>
            </div>
            <div class="match-status completed">
                ${match.winner ? `Ganó: ${match.winner.name}` : 'Empate'}
            </div>
        ` : `
            <div class="match-status">
                Pendiente
            </div>
        `}
    `;
    
    if (!match.completed) {
        matchCard.addEventListener('click', () => openMatchModal(match));
    }
    
    return matchCard;
}

function checkPlayoffsCompletion() {
    // Verificar si las semifinales están completas
    const semifinalsCompleted = tournamentState.playoffs.semifinals.every(match => match.completed);
    
    if (semifinalsCompleted && !tournamentState.playoffs.final) {
        // Crear final con los ganadores de semifinales
        const winner1 = tournamentState.playoffs.semifinals[0].winner;
        const winner2 = tournamentState.playoffs.semifinals[1].winner;
        
        if (winner1 && winner2) {
            tournamentState.playoffs.final = {
                id: 'final',
                player1: winner1,
                player2: winner2,
                score1: null,
                score2: null,
                winner: null,
                completed: false,
                round: 'final'
            };
            
            updateFinalDisplay();
            updateEVAMessage("¡Final definida! " + winner1.name + " vs " + winner2.name + ". ¡Partidazo en perspectiva!");
            
            // Forzar actualización visual
            setTimeout(() => {
                updatePlayoffsDisplay();
            }, 100);
        }
    }
    
    // Verificar si la final está completa
    const finalCompleted = tournamentState.playoffs.final && tournamentState.playoffs.final.completed;
    
    const viewResultsBtn = document.getElementById('view-results-btn');
    if (viewResultsBtn) {
        viewResultsBtn.disabled = !finalCompleted;
    }
    
    if (finalCompleted && tournamentState.playoffs.final) {
        tournamentState.champion = tournamentState.playoffs.final.winner;
        if (viewResultsBtn) {
            viewResultsBtn.innerHTML = '<i class="fas fa-award"></i> Ver Campeón';
        }
        updateEVAMessage("¡CAMPEÓN DEFINIDO! " + tournamentState.champion.name + " se corona campeón. 🏆");
        
        // Auto-redirigir a resultados después de un delay
        setTimeout(() => {
            if (tournamentState.champion) {
                showResultsScreen();
            }
        }, 2000);
    }
}

// Pantalla de Resultados
function showResultsScreen() {
    if (!tournamentState.champion) {
        alert('El torneo aún no ha terminado. ¡Completa la final primero!');
        return;
    }
    
    updateResultsDisplay();
    switchScreen('results-screen');
    createConfetti();
}

function updateResultsDisplay() {
    document.getElementById('champion-name').textContent = tournamentState.champion.name;
    
    const championCard = document.getElementById('champion-card');
    
    championCard.innerHTML = `
        <div class="champion-info">
            <div class="champion-avatar">
                <img src="${tournamentState.champion.avatar}" alt="${tournamentState.champion.name}" onerror="this.src='https://via.placeholder.com/120/007bff/ffffff?text=🏆'">
            </div>
            <div class="champion-details">
                <h3>${tournamentState.champion.name}</h3>
                <p><i class="fas fa-hashtag"></i> Número ${tournamentState.champion.number}</p>
                <p><i class="fas fa-trophy"></i> ${tournamentState.champion.style}</p>
                <p><i class="fas fa-flag"></i> ${tournamentState.champion.country}</p>
                <div class="champion-stats">
                    <strong>${tournamentState.champion.points || 0} puntos</strong> | 
                    <strong>${tournamentState.champion.matchesWon || 0}V-${tournamentState.champion.matchesLost || 0}D</strong>
                </div>
            </div>
        </div>
    `;
    
    const rankingContainer = document.getElementById('final-ranking');
    rankingContainer.innerHTML = '';
    
    // Crear ranking final CON DATOS REALES
    const rankedPlayers = getFinalRanking();
    rankedPlayers.forEach((player, index) => {
        const li = document.createElement('li');
        li.className = 'ranking-item';
        
        let positionText = `${index + 1}`;
        if (index === 0) positionText = '🥇';
        else if (index === 1) positionText = '🥈';
        else if (index === 2) positionText = '🥉';
        
        li.innerHTML = `
            <div class="ranking-position">${positionText}</div>
            <div class="ranking-player">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="player-avatar-small">
                        <img src="${player.avatar}" alt="${player.name}" onerror="this.src='https://via.placeholder.com/40/007bff/ffffff?text=?'">
                    </div>
                    ${player.name} (#${player.number})
                </div>
            </div>
            <div class="ranking-stats">
                <div class="ranking-stat">
                    <div class="ranking-stat-value">${player.points || 0}</div>
                    <div class="ranking-stat-label">Puntos</div>
                </div>
                <div class="ranking-stat">
                    <div class="ranking-stat-value">${player.matchesWon || 0}-${player.matchesLost || 0}</div>
                    <div class="ranking-stat-label">Récord</div>
                </div>
                <div class="ranking-stat">
                    <div class="ranking-stat-value">${player.matchesPlayed || 0}</div>
                    <div class="ranking-stat-label">Partidos</div>
                </div>
            </div>
        `;
        rankingContainer.appendChild(li);
    });
}

function getFinalRanking() {
    if (!tournamentState.champion) return tournamentState.standings;
    
    // El campeón es el primero
    const champion = tournamentState.champion;
    
    // El subcampeón es el perdedor de la final
    let runnerUp = null;
    if (tournamentState.playoffs.final) {
        runnerUp = tournamentState.playoffs.final.player1.id === champion.id ? 
            tournamentState.playoffs.final.player2 : tournamentState.playoffs.final.player1;
    }
    
    // Los semifinalistas que no llegaron a la final
    const semifinalLosers = [];
    if (tournamentState.playoffs.semifinals) {
        tournamentState.playoffs.semifinals.forEach(match => {
            if (match.player1.id === champion.id || match.player2.id === champion.id) {
                const loser = match.player1.id === champion.id ? match.player2 : match.player1;
                if (loser.id !== runnerUp?.id) {
                    semifinalLosers.push(loser);
                }
            } else {
                // Si el campeón no viene de esta semifinal, ambos son semifinalistas
                if (match.player1.id !== runnerUp?.id) semifinalLosers.push(match.player1);
                if (match.player2.id !== runnerUp?.id) semifinalLosers.push(match.player2);
            }
        });
    }
    
    // Eliminar duplicados
    const uniqueSemifinalLosers = [...new Set(semifinalLosers)];
    
    // Los jugadores que no llegaron a playoffs, ordenados por puntos
    const nonPlayoffPlayers = tournamentState.standings.filter(player => 
        player.id !== champion.id && 
        (!runnerUp || player.id !== runnerUp.id) &&
        !uniqueSemifinalLosers.some(sl => sl.id === player.id)
    );
    
    return [champion, runnerUp, ...uniqueSemifinalLosers, ...nonPlayoffPlayers].filter(Boolean);
}

// Navegación entre pantallas
function showDrawScreen() {
    switchScreen('draw-screen');
}

function showLeagueScreen() {
    switchScreen('league-screen');
}

function showPlayoffsScreen() {
    switchScreen('playoffs-screen');
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function newTournament() {
    if (confirm('¿Estás seguro de que quieres comenzar un nuevo torneo? Se perderán todos los datos actuales.')) {
        initializeTournament();
    }
}

// E.V.A. Functions
function updateEVAMessage(message) {
    const evaMessage = document.getElementById('eva-message');
    if (evaMessage) {
        evaMessage.textContent = message;
    }
}

// Efectos de confeti
function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const colors = ['#ff6600', '#0066cc', '#00cc66', '#ffcc00', '#9966cc', '#ff6666', '#66cccc'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        container.appendChild(confetti);
        
        const animation = confetti.animate([
            { opacity: 1, transform: `translateY(0) rotate(0deg)` },
            { opacity: 1, transform: `translateY(${Math.random() * 100 + 50}vh) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg)` }
        ], {
            duration: 2000 + Math.random() * 3000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeTournament();
    setupEventListeners();
});

