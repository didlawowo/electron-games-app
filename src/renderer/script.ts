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

// 🔑 Extension de la window globale
declare global {
    interface Window {
        api: Api;
    }
}

// 🔄 Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM loaded, setting up event listeners');
    
    // 🔐 Login handler
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            console.log('🔐 Login button clicked');
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;

            try {
                console.log('🌐 Sending login request for user:', username);
                const result = await window.api.login({ username, password });
                if (result.success) {
                    console.log('✅ Login successful');
                    showGamesList();
                } else {
                    console.log('❌ Login failed:', result.error);
                    alert('Login failed: ' + (result.error || 'Invalid credentials'));
                }
            } catch (error) {
                console.error('🚨 Login error:', error);
                alert('An error occurred during login');
            }
        });
    } else {
        console.error('🚨 Login button not found in DOM');
    }

    // 🚪 Logout handler
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log('🚪 Logout clicked');
            document.getElementById('loginForm')!.classList.remove('hidden');
            document.getElementById('gamesList')!.classList.add('hidden');
            
            (document.getElementById('username') as HTMLInputElement).value = '';
            (document.getElementById('password') as HTMLInputElement).value = '';
        });
    } else {
        console.error('🚨 Logout button not found in DOM');
    }
});

// 🎮 Games list display
async function showGamesList(): Promise<void> {
    try {
        console.log('🎮 Fetching games list');
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
        console.log('✅ Games list displayed');
    } catch (error) {
        console.error('🚨 Error loading games:', error);
        alert('Failed to load games list');
    }
}

// Nécessaire pour que TypeScript traite ce fichier comme un module
export {};