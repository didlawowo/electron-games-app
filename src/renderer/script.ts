declare global {
    interface Window {
        api: {
            login: (credentials: { username: string, password: string }) => Promise<{ success: boolean, error?: string }>;
            getGames: () => Promise<Array<{ id: number, name: string, genre: string }>>;
        }
    }
}

async function handleLogin() {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const result = await window.api.login({ username, password });

    if (result.success) {
        showGamesList();
    } else {
        alert('Login failed: ' + (result.error || 'Invalid credentials'));
    }
}

async function showGamesList() {
    document.getElementById('loginForm')!.classList.add('hidden');
    document.getElementById('gamesList')!.classList.remove('hidden');

    const games = await window.api.getGames();
    const gamesContainer = document.getElementById('games')!;
    
    gamesContainer.innerHTML = games
        .map(game => `
            <div class="game-item">
                <h3>${game.name}</h3>
                <p>Genre: ${game.genre}</p>
            </div>
        `)
        .join('');
}

function handleLogout() {
    document.getElementById('loginForm')!.classList.remove('hidden');
    document.getElementById('gamesList')!.classList.add('hidden');
    
    (document.getElementById('username') as HTMLInputElement).value = '';
    (document.getElementById('password') as HTMLInputElement).value = '';
}