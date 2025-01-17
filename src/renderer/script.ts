// 🌐 Type declarations for the API
interface GameType {
    id: number;
    name: string;
    genre: string;
}

interface Api {
    login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
    getGames: () => Promise<GameType[]>;
}
export { };
// 🔑 Extension de la window globale
declare global {
    interface Window {
        api: Api;
    }
}

// 🔄 Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // 🔐 Login handler
    document.getElementById('loginButton')?.addEventListener('click', async () => {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const result = await window.api.login({ username, password });
            if (result.success) {
                showGamesList();
            } else {
                alert('Login failed: ' + (result.error || 'Invalid credentials'));
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    });

    // 🚪 Logout handler
    document.getElementById('logoutButton')?.addEventListener('click', () => {
        document.getElementById('loginForm')!.classList.remove('hidden');
        document.getElementById('gamesList')!.classList.add('hidden');

        (document.getElementById('username') as HTMLInputElement).value = '';
        (document.getElementById('password') as HTMLInputElement).value = '';
    });
});

// 🎮 Games list display
async function showGamesList(): Promise<void> {
    try {
        document.getElementById('loginForm')!.classList.add('hidden');
        document.getElementById('gamesList')!.classList.remove('hidden');

        const games = await window.api.getGames();
        const gamesContainer = document.getElementById('games')!;

        gamesContainer.innerHTML = games
            .map((game: GameType) => `
                <div class="game-item">
                    <h3>${game.name}</h3>
                    <p>Genre: ${game.genre}</p>
                </div>
            `)
            .join('');
    } catch (error) {
        console.error('Error loading games:', error);
        alert('Failed to load games list');
    }
}