document.addEventListener('DOMContentLoaded', async () => {
    // --- All DOM element selectors ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const appContainer = document.querySelector('.app-container');
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');
    const profileButton = document.getElementById('profile-button');
    const pointsValueTop = document.getElementById('points-value');
    const profileNameEl = document.getElementById('profile-name');
    const profilePointsEl = document.getElementById('profile-points-value');
    const profileTotalPointsStatEl = document.getElementById('profile-total-points-stat');
    const profileTotalPullsStatEl = document.getElementById('profile-total-pulls-stat');
    const pullsAmountEl = document.getElementById('currency-amount');
    const pullButton = document.getElementById('pull-button');
    const watchAdButton = document.getElementById('watch-ad-button');
    const resultText = document.getElementById('result-text');
    const reels = document.querySelectorAll('.reel');
    const reelInners = document.querySelectorAll('.reel-inner');
    const shutter = document.querySelector('.reel-shutter');
    const tonBalanceEl = document.getElementById('ton-balance');
    const solBalanceEl = document.getElementById('sol-balance');
    const exchangeButton = document.getElementById('exchange-button');
    const withdrawButton = document.getElementById('withdraw-button');
    const pointsToExchangeInput = document.getElementById('points-to-exchange');
    const exchangeCryptoSelect = document.getElementById('exchange-crypto-select');
    const exchangeFeedbackEl = document.getElementById('exchange-feedback');
    const withdrawalAmountInput = document.getElementById('withdrawal-amount');
    const cryptoSelect = document.getElementById('crypto-select');
    const walletAddressInput = document.getElementById('wallet-address');
    const withdrawalFeedbackEl = document.getElementById('withdrawal-feedback');
    const tasksContainer = document.getElementById('tasks-container');
    const historyDetails = document.getElementById('history-details');
    const withdrawalHistoryContainer = document.getElementById('withdrawal-history-container');
    const closeProfileButton = document.getElementById('close-profile-button');
    const leaderboardDetails = document.getElementById('leaderboard-details');
    const leaderboardList = document.getElementById('leaderboard-list');
    const announcementModal = document.getElementById('announcement-modal');
    const closeAnnouncementButton = document.getElementById('close-announcement-button');
    const shareGameButton = document.getElementById('share-game-button');
    const tapSound = document.getElementById('tap-sound');
    const spinSound = document.getElementById('spin-sound');
    const backgroundMusic = document.getElementById('background-music');
    const withdrawalGateNotice = document.getElementById('withdrawal-gate-notice');
    const withdrawalFieldset = document.getElementById('withdrawal-fieldset');
    const userCountProgress = document.getElementById('user-count-progress');
    const userProgressBarInner = document.getElementById('user-progress-bar-inner');
    const treasureBtnFloat = document.getElementById('floating-treasure-button');
    const ticketBtnFloat = document.getElementById('floating-ticket-button');
    const treasureTimerFloat = document.getElementById('treasure-timer-float');
    const ticketTimerFloat = document.getElementById('ticket-timer-float');
    const openDailyRewardButton = document.getElementById('open-daily-reward-button');
    const dailyRewardModal = document.getElementById('daily-reward-modal');
    const closeDailyRewardButton = document.getElementById('close-daily-reward-button');
    const dailyRewardGrid = document.getElementById('daily-reward-grid');
    const openStatsButton = document.getElementById('open-stats-button');
    const statsModal = document.getElementById('stats-modal');
    const closeStatsButton = document.getElementById('close-stats-button');
    const totalUsersValueEl = document.getElementById('total-users-value');
    const totalPointsValueEl = document.getElementById('total-points-value');
    const walletTonBalanceEl = document.getElementById('wallet-ton-balance');
    const walletSolBalanceEl = document.getElementById('wallet-sol-balance');

    // --- Card Game Selectors ---
    const cardChancesAmountEl = document.getElementById('card-chances-amount');
    const playCardGameButton = document.getElementById('play-card-game-button');
    const watchAdForCardsButton = document.getElementById('watch-ad-for-cards-button');
    const cardAdTimerEl = document.getElementById('card-ad-timer');
    const buyChancesButton = document.getElementById('buy-chances-button');
    const cardDeck = document.getElementById('card-deck');
    const cardGameChancesLeftEl = document.getElementById('card-game-chances-left');
    const cardGameInstructionsEl = document.getElementById('card-game-instructions');
    const cardGameResultsModal = document.getElementById('card-game-results-modal');
    const cardGameResultTitle = document.getElementById('card-game-result-title');
    const cardGameRewardsList = document.getElementById('card-game-rewards-list');
    const exitCardGameButton = document.getElementById('exit-card-game-button');


    // =================================================================
    // --- SUPABASE & SDK INITIALIZATION ---
    // =================================================================
    const SUPABASE_URL = 'https://vddnlobgtnwwplburlja.supabase.co';
    // FIXED: The typo "leaner" has been removed from the key.
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZG5sb2JndG53d3BsYnVybGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDEyMTcsImV4cCI6MjA3NTUxNzIxN30.2zYyICX5QyNDcLcGWia1F04yXPfNH6M09aczNlsLFSM';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const AdController = window.Adsgram.init({ blockId: "int-14190" });
    const TreasureAdController = window.Adsgram.init({ blockId: "int-15943" });
    const TicketAdController = window.Adsgram.init({ blockId: "int-15944" });
    const CardGameAdController = window.Adsgram.init({ blockId: "int-15864" });

    // =================================================================
    // --- CONFIGURATIONS & CONSTANTS ---
    // =================================================================
    const POINTS_PER_BLOCK = 1000000;
    const TON_PER_BLOCK = 0.3;
    const SOL_PER_BLOCK = 0.0038;
    const WITHDRAWAL_FEE_PERCENT = 5;
    const MIN_TON_WITHDRAWAL = 1;
    const MIN_SOL_WITHDRAWAL = 0.01;
    const WITHDRAWAL_USER_GATE = 1000;
    const GACHA_ITEMS = [ { symbol: '🍓', points: 5 }, { symbol: '🍌', points: 10 }, { symbol: '🍊', points: 15 }, { symbol: '🍉', points: 20 }, { symbol: '🥑', points: 25 }, { symbol: '🌶️', points: 30 }, { symbol: '🍇', points: 35 }, { symbol: '💎', points: 40 } ];
    const STREAK_REWARDS = [ { day: 1, points: 2000, pulls: 3 }, { day: 2, points: 4000, pulls: 5 }, { day: 3, points: 6000, pulls: 7 }, { day: 4, points: 8000, pulls: 9 }, { day: 5, points: 10000, pulls: 10 }, { day: 6, points: 10000, pulls: 11 }, { day: 7, points: 25000, pulls: 20 } ];
    const DAILY_TASK_KEYS = ['pull10', 'watch2', 'winPair', 'earn10k', 'winJackpot'];
    const TREASURE_COOLDOWN = 3 * 60 * 1000;
    const TREASURE_REWARD_POINTS = 2000;
    const TICKET_COOLDOWN = 5 * 60 * 1000;
    const TICKET_REWARD_PULLS = 6;
    const CARD_AD_COOLDOWN = 3 * 60 * 1000;
    const CARD_CHANCES_COST = 5000;
    const CARD_GAME_REWARDS = {
        bomb: { type: 'bomb', icon: '💣', value: 0, text: 'Bomb!' },
        points: { type: 'points', icon: '🍉', value: 100, text: '+100 Points' },
        ton: { type: 'ton', icon: '💎', value: 0.0005, text: '+0.0005 TON' },
        sol: { type: 'sol', icon: '⚡', value: 0.00005, text: '+0.00005 SOL' }
    };

    // --- STATE MANAGEMENT ---
    let user = {}; 
    let tasks = {}; 
    let taskProgress = {};
    let isSpinning = false;
    let totalUserCount = 0;
    let cardGameDeck = [];
    let selectedCards = [];
    let isCardGameActive = false;
    
    // =================================================================
    // --- DATA & INITIALIZATION LOGIC ---
    // =================================================================

    const main = async () => {
        if (!loadingOverlay || !appContainer) {
            console.error('Critical DOM elements (#loading-overlay or .app-container) are missing. Halting script.');
            document.body.innerHTML = '<p style="color: red; font-family: sans-serif; text-align: center; padding: 20px;">Error: App HTML structure is broken. Please contact support.</p>';
            return;
        }

        setupEventListeners();
        
        const TWA = window.Telegram.WebApp;
        
        if (!TWA || !TWA.initDataUnsafe || !TWA.initDataUnsafe.user || !TWA.initDataUnsafe.user.id) {
            console.error("Telegram user data not found. This app must be run inside Telegram.");
            loadingOverlay.style.display = 'none';
            document.body.innerHTML = '<p style="color: #ff5572; font-family: sans-serif; text-align: center; padding: 20px; background-color: #0d0c1d; height: 100vh; margin: 0; display: grid; place-content: center;">This application can only be run inside the Telegram app.</p>';
            return;
        }
        
        TWA.ready();
        TWA.expand();
        const telegramUser = TWA.initDataUnsafe.user;

        await loadInitialData(telegramUser);
        await checkDailyResets();
        await checkWithdrawalGate();
        updateAllUI();
        updateButtonStates();
        renderTasksPage();
        initializeTimedRewards();
        loadingOverlay.style.opacity = '0';
        appContainer.style.opacity = '1';
        setTimeout(() => loadingOverlay.style.display = 'none', 500);
        handleAnnouncement();
        playBGM();
    };

    const loadInitialData = async (telegramUser) => {
        let { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('telegram_id', telegramUser.id).single();
        if (profileError && profileError.code !== 'PGRST116') throw new Error(`Could not fetch profile: ${profileError.message}`);
        if (!profileData) {
            const fullName = `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim();
            const { data: newUser, error: createError } = await supabase.from('profiles').insert({ 
                telegram_id: telegramUser.id, 
                username: telegramUser.username ? '@' + telegramUser.username : 'No Username', 
                full_name: fullName || 'Gamer', 
                points: 1250, 
                pulls: 20, 
                card_chances: 0,
                last_card_ad_claim: new Date(0).toISOString()
            }).select().single();
            if (createError) throw new Error(`Could not create profile: ${createError.message}`);
            profileData = newUser;
        }
        user = profileData;
        const today = getTodayDateString();
        const [taskDefsResult, progressResult] = await Promise.all([ supabase.from('tasks').select('*'), supabase.from('user_task_progress').select('*').eq('user_id', user.id).eq('date', today) ]);
        if (taskDefsResult.error) throw new Error('Could not fetch task definitions');
        if (progressResult.error) throw new Error('Could not fetch task progress');
        tasks = taskDefsResult.data.reduce((acc, task) => { acc[task.id] = task; return acc; }, {});
        const progressByTaskId = progressResult.data.reduce((acc, p) => { acc[p.task_id] = p; return acc; }, {});
        taskProgress = {};
        for (const taskId in tasks) { const task = tasks[taskId]; taskProgress[task.task_key] = progressByTaskId[taskId] || { current_progress: 0, is_claimed: false }; }
    };
    
    async function updateUserProfile(updateData) {
        Object.assign(user, updateData);
        const { data: updatedUser, error } = await supabase.from('profiles').update(updateData).eq('id', user.id).select().single();
        if (error) { console.error("Error updating profile:", error); } else { user = updatedUser; }
    }
    
    async function updateTaskProgress(taskKey, incrementValue = 1) {
        const taskDef = Object.values(tasks).find(t => t.task_key === taskKey);
        if (!taskDef) return;
        const currentProg = taskProgress[taskKey]?.current_progress || 0;
        const newProgress = currentProg + incrementValue;
        taskProgress[taskKey].current_progress = newProgress;
        await supabase.from('user_task_progress').upsert({ user_id: user.id, task_id: taskDef.id, date: getTodayDateString(), current_progress: newProgress }, { onConflict: 'user_id, task_id, date' });
    }
    
    // =================================================================
    // --- UI, SOUND & EVENT LISTENERS ---
    // =================================================================
    
    function playTapSound() { if (tapSound) { tapSound.currentTime = 0; tapSound.play().catch(e => {}); } }
    function playBGM() { if (backgroundMusic) { backgroundMusic.volume = 0.3; backgroundMusic.play().catch(() => { document.body.addEventListener('click', () => backgroundMusic.play(), { once: true }); }); } }

    function setupEventListeners() {
        document.querySelectorAll('button, details > summary, .nav-button, .profile-icon').forEach(el => { if(el) el.addEventListener('click', playTapSound); });
        navButtons.forEach(button => button.addEventListener('click', () => navigateTo(button.dataset.page)));
        if (profileButton) profileButton.addEventListener('click', () => navigateTo('profile-page'));
        if (pullButton) pullButton.addEventListener('click', handlePull);
        if (watchAdButton) watchAdButton.addEventListener('click', handleWatchAd);
        if (exchangeButton) exchangeButton.addEventListener('click', handleExchange);
        if (withdrawButton) withdrawButton.addEventListener('click', handleWithdraw);
        if (treasureBtnFloat) treasureBtnFloat.addEventListener('click', handleClaimTreasure);
        if (ticketBtnFloat) ticketBtnFloat.addEventListener('click', handleClaimTickets);
        if (historyDetails) historyDetails.addEventListener('toggle', handleHistoryToggle);
        if (closeProfileButton) closeProfileButton.addEventListener('click', () => navigateTo('home-page'));
        if (leaderboardDetails) leaderboardDetails.addEventListener('toggle', handleLeaderboardToggle);
        if (closeAnnouncementButton) closeAnnouncementButton.addEventListener('click', () => announcementModal.classList.add('hidden'));
        if (shareGameButton) shareGameButton.addEventListener('click', () => { const TWA = window.Telegram.WebApp; if (TWA && TWA.switchInlineQuery) TWA.switchInlineQuery('Come play YTD Gacha Game!'); else alert("Share feature is available only within Telegram."); });
        
        if (openDailyRewardButton) openDailyRewardButton.addEventListener('click', () => { renderDailyRewardModal(); dailyRewardModal.classList.remove('hidden'); });
        if (closeDailyRewardButton) closeDailyRewardButton.addEventListener('click', () => dailyRewardModal.classList.add('hidden'));
        if (openStatsButton) openStatsButton.addEventListener('click', () => { fetchAndRenderEventStats(); statsModal.classList.remove('hidden'); });
        if (closeStatsButton) closeStatsButton.addEventListener('click', () => statsModal.classList.add('hidden'));

        if (playCardGameButton) playCardGameButton.addEventListener('click', startCardGame);
        if (watchAdForCardsButton) watchAdForCardsButton.addEventListener('click', handleWatchAdForCards);
        if (buyChancesButton) buyChancesButton.addEventListener('click', handleBuyChances);
        if (exitCardGameButton) exitCardGameButton.addEventListener('click', () => {
            cardGameResultsModal.classList.add('hidden');
            navigateTo('home-page');
        });
    }

    function handleAnnouncement() { if (announcementModal) announcementModal.classList.remove('hidden'); }
    
    function navigateTo(pageId) { 
        pages.forEach(page => page.classList.remove('active')); 
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active'); 
        navButtons.forEach(button => button.classList.toggle('active', button.dataset.page === pageId)); 
        if (pageId === 'tasks-page') renderTasksPage(); 
        if (pageId === 'wallet-page') { fetchAndRenderWithdrawalHistory(); checkWithdrawalGate(); } 
    }
    
    function updateAllUI() { 
        if (!user || !user.id) return; 
        const newPoints = Math.floor(user.points); 
        const newPulls = user.pulls;
        const newCardChances = user.card_chances || 0;

        if (pointsValueTop) {
             const oldPoints = parseInt(pointsValueTop.textContent.replace(/,/g, ''), 10); 
             if(oldPoints !== newPoints) {
                pointsValueTop.classList.add('pulse'); 
                setTimeout(() => pointsValueTop.classList.remove('pulse'), 600); 
             }
             pointsValueTop.textContent = newPoints.toLocaleString(); 
        }

        if (profileNameEl) profileNameEl.textContent = user.full_name;
        if (profilePointsEl) profilePointsEl.textContent = newPoints.toLocaleString();
        if (profileTotalPointsStatEl) profileTotalPointsStatEl.textContent = newPoints.toLocaleString();
        if (profileTotalPullsStatEl) profileTotalPullsStatEl.textContent = newPulls.toLocaleString();
        if (pullsAmountEl) pullsAmountEl.textContent = newPulls;
        if (cardChancesAmountEl) cardChancesAmountEl.textContent = newCardChances;
        
        const tonBalance = parseFloat(user.ton_balance).toFixed(6);
        const solBalance = parseFloat(user.sol_balance).toFixed(6);
        
        if (tonBalanceEl) tonBalanceEl.textContent = parseFloat(user.ton_balance).toFixed(2);
        if (solBalanceEl) solBalanceEl.textContent = parseFloat(user.sol_balance).toFixed(4);
        if (walletTonBalanceEl) walletTonBalanceEl.textContent = tonBalance;
        if (walletSolBalanceEl) walletSolBalanceEl.textContent = solBalance;
    }
    
    function updateButtonStates() { 
        if (isSpinning || !user?.id) return;
        
        if (pullButton) {
            if (user.pulls > 0) { 
                pullButton.disabled = false; 
                watchAdButton.disabled = true; 
                resultText.textContent = "PULL THE LEVER!"; 
            } else { 
                pullButton.disabled = true; 
                watchAdButton.disabled = false; 
                resultText.textContent = "WATCH AD TO PLAY"; 
            }
        }

        const cardChances = user.card_chances || 0;
        if (playCardGameButton) playCardGameButton.disabled = cardChances <= 0;
        if (buyChancesButton) buyChancesButton.disabled = user.points < CARD_CHANCES_COST;
    }
    
    async function checkDailyResets() { const today = getTodayDateString(); const lastClaimDateStr = user.last_streak_claim_date; if (lastClaimDateStr && lastClaimDateStr !== today) { const lastClaimDate = new Date(lastClaimDateStr); const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); if (lastClaimDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0]) { await updateUserProfile({ daily_streak: 0 }); } } }
    
    function getTodayDateString() { return new Date().toISOString().split('T')[0]; }
    
    function renderTasksPage() { renderDailyTasks(); }

    function renderDailyRewardModal() { 
        if (!dailyRewardGrid) return;
        dailyRewardGrid.innerHTML = ''; 
        const today = getTodayDateString(); 
        STREAK_REWARDS.forEach(reward => { 
            const isClaimed = user.daily_streak >= reward.day; 
            const isClaimable = user.daily_streak + 1 === reward.day && user.last_streak_claim_date !== today; 
            
            const itemEl = document.createElement('div'); 
            itemEl.className = 'reward-day-item';
            if(reward.day === 7) itemEl.classList.add('day-7');
            if (isClaimable) itemEl.classList.add('claimable'); 
            if (isClaimed) itemEl.classList.add('claimed'); 
            if (!isClaimed && !isClaimable) itemEl.classList.add('locked');
            
            let rewardIcon = '';
            let rewardAmount = '';
            if(reward.points > 0 && reward.pulls > 0) {
                 rewardIcon = '💎';
                 rewardAmount = `+${reward.points.toLocaleString()} & 🎟️+${reward.pulls}`;
            } else if (reward.points > 0) {
                rewardIcon = '💎';
                rewardAmount = `+${reward.points.toLocaleString()}`;
            } else if (reward.pulls > 0) {
                rewardIcon = '🎟️';
                rewardAmount = `+${reward.pulls}`;
            }

            let statusIcon = '';
            if (!isClaimed && !isClaimable) statusIcon = '🔒';

            itemEl.innerHTML = `
                <div class="day-label">Day ${reward.day}</div>
                <div class="reward-icon">${reward.day === 7 ? '🎁' : rewardIcon}</div>
                <div class="reward-amount">${rewardAmount}</div>
                ${statusIcon ? `<div class="status-icon">${statusIcon}</div>` : ''}
            `;
            
            if (isClaimable) { 
                itemEl.onclick = () => claimStreakReward(reward.day); 
            } 
            dailyRewardGrid.appendChild(itemEl); 
        }); 
    }

    function renderDailyTasks() { 
        if (!tasksContainer) return;
        tasksContainer.innerHTML = ''; 
        if (Object.keys(tasks).length === 0) { 
            tasksContainer.innerHTML = '<p class="placeholder-text">Loading tasks...</p>'; 
            return; 
        } 
        DAILY_TASK_KEYS.forEach(taskKey => { 
            const taskDef = Object.values(tasks).find(t => t.task_key === taskKey); 
            if (!taskDef) return; 
            const progress = taskProgress[taskKey]?.current_progress || 0; 
            const isClaimed = taskProgress[taskKey]?.is_claimed || false; 
            const isComplete = progress >= taskDef.target_value; 
            let rewardText = taskDef.reward_type === 'points' ? `+${taskDef.reward_amount.toLocaleString()} PTS` : `+${taskDef.reward_amount} Pulls`; 
            const taskEl = document.createElement('div'); 
            taskEl.className = 'task-item'; 
            taskEl.innerHTML = `<div class="task-info"><p>${taskDef.description} (${progress}/${taskDef.target_value})</p><div class="progress-bar"><div class="progress-bar-inner" style="width: ${Math.min(100, (progress / taskDef.target_value) * 100)}%;"></div></div></div><div class="task-reward">${rewardText}</div><button class="claim-button" data-task-key="${taskDef.task_key}" ${(!isComplete || isClaimed) ? 'disabled' : ''}>${isClaimed ? 'Claimed' : 'Claim'}</button>`; 
            tasksContainer.appendChild(taskEl); 
        }); 
        tasksContainer.querySelectorAll('.claim-button').forEach(button => button.addEventListener('click', (e) => claimTaskReward(e.currentTarget.dataset.taskKey))); 
    }

    function showFeedback(element, message, type) { 
        if (!element) return;
        element.textContent = message; 
        element.className = `feedback-message ${type} show`; 
        setTimeout(() => { element.classList.remove('show'); }, 4000); 
    }
    
    // --- GAME ACTIONS ---
    function initializeTimedRewards() { setInterval(updateAllTimers, 1000); updateAllTimers(); }
    
    function updateAllTimers() {
        updateFloatingRewards();
        updateCardAdTimer();
    }
    
    function formatTime(ms) { const totalSeconds = Math.ceil(ms / 1000); const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }

    function updateFloatingRewards() { 
        if (!treasureBtnFloat || !ticketBtnFloat) return;
        const now = Date.now(); 
        const lastTreasureClaim = user.last_treasure_claim ? new Date(user.last_treasure_claim).getTime() : 0; 
        const treasureCooldownEnd = lastTreasureClaim + TREASURE_COOLDOWN; 
        if (now < treasureCooldownEnd) { 
            treasureTimerFloat.textContent = formatTime(treasureCooldownEnd - now); 
            treasureBtnFloat.disabled = true; 
        } else { 
            treasureTimerFloat.textContent = ''; 
            treasureBtnFloat.disabled = false; 
        } 
        const lastTicketClaim = user.last_ticket_claim ? new Date(user.last_ticket_claim).getTime() : 0; 
        const ticketCooldownEnd = lastTicketClaim + TICKET_COOLDOWN; 
        if (now < ticketCooldownEnd) { 
            ticketTimerFloat.textContent = formatTime(ticketCooldownEnd - now); 
            ticketBtnFloat.disabled = true; 
        } else { 
            ticketTimerFloat.textContent = ''; 
            ticketBtnFloat.disabled = false; 
        } 
    }

    async function handleClaimTreasure() { if (treasureBtnFloat.disabled) return; treasureBtnFloat.disabled = true; try { await TreasureAdController.show(); await updateUserProfile({ points: user.points + TREASURE_REWARD_POINTS, last_treasure_claim: new Date().toISOString() }); updateAllUI(); } catch (e) { console.error("Treasure ad failed.", e); } finally { updateFloatingRewards(); } }
    async function handleClaimTickets() { if (ticketBtnFloat.disabled) return; ticketBtnFloat.disabled = true; try { await TicketAdController.show(); await updateUserProfile({ pulls: user.pulls + TICKET_REWARD_PULLS, last_ticket_claim: new Date().toISOString() }); updateAllUI(); updateButtonStates(); } catch (e) { console.error("Ticket ad failed.", e); } finally { updateFloatingRewards(); } }
    async function claimStreakReward(day) {
        const today = getTodayDateString();
        if (user.last_streak_claim_date === today || user.daily_streak + 1 !== day) return;
        const reward = STREAK_REWARDS.find(r => r.day === day);
        await updateUserProfile({
            daily_streak: user.daily_streak + 1,
            last_streak_claim_date: today,
            points: user.points + (reward.points || 0),
            pulls: user.pulls + (reward.pulls || 0)
        });
        updateAllUI();
        updateButtonStates();
        renderDailyRewardModal();
    }
    async function claimTaskReward(taskKey) { const progressData = taskProgress[taskKey]; if (!progressData || progressData.is_claimed) return; const taskDef = Object.values(tasks).find(t => t.task_key === taskKey); if (progressData.current_progress >= taskDef.target_value) { let profileUpdate = {}; if (taskDef.reward_type === 'points') profileUpdate.points = user.points + taskDef.reward_amount; else if (taskDef.reward_type === 'pulls') profileUpdate.pulls = user.pulls + taskDef.reward_amount; await updateUserProfile(profileUpdate); progressData.is_claimed = true; await supabase.from('user_task_progress').update({ is_claimed: true }).match({ user_id: user.id, task_id: taskDef.id, date: getTodayDateString() }); updateAllUI(); updateButtonStates(); renderTasksPage(); } }
    function handleWatchAd() { if (!watchAdButton || !resultText) return; watchAdButton.disabled = true; watchAdButton.textContent = "LOADING AD..."; AdController.show().then(async () => { await updateUserProfile({ pulls: user.pulls + 10 }); await updateTaskProgress('watch2'); updateAllUI(); updateButtonStates(); resultText.textContent = "YOU GOT 10 PULLS!"; }).catch(() => { resultText.textContent = "AD FAILED. NO REWARD."; }).finally(() => { watchAdButton.disabled = false; watchAdButton.textContent = "WATCH AD FOR 10 PULLS"; updateButtonStates(); renderTasksPage(); }); }
    
    // =================================================================
    // === GACHA ANIMATION LOGIC ===
    // =================================================================

    function getRandomIcon() { return GACHA_ITEMS[Math.floor(Math.random() * GACHA_ITEMS.length)]; }

    async function handlePull() {
        if (user.pulls <= 0 || isSpinning || !shutter || !resultText || !pullButton || !watchAdButton) return;
        isSpinning = true;

        shutter.classList.add('open');
        await updateUserProfile({ pulls: user.pulls - 1 });
        await updateTaskProgress('pull10');
        updateAllUI();
        pullButton.disabled = true;
        watchAdButton.disabled = true;
        resultText.textContent = 'SPINNING...';
        resultText.classList.remove('win', 'jackpot');
        
        if (spinSound) { spinSound.currentTime = 0; spinSound.play().catch(e => {}); }

        const results = [getRandomIcon(), getRandomIcon(), getRandomIcon()];
        const spinPromises = [];

        reels.forEach((reel, i) => {
            const reelInner = reel.querySelector('.reel-inner');
            if (!reelInner) return;
            const promise = new Promise(resolve => {
                reelInner.innerHTML = `<div class="reel-icon" style="top: -100%">${getRandomIcon().symbol}</div><div class="reel-icon" style="top: 0%">${getRandomIcon().symbol}</div><div class="reel-icon" style="top: 100%">${results[i].symbol}</div>`;
                setTimeout(() => {
                    reel.classList.add('spinning');
                    setTimeout(() => {
                        reel.classList.remove('spinning');
                        reelInner.innerHTML = `<div class="reel-icon bounce">${results[i].symbol}</div>`;
                        resolve();
                    }, 1500 + i * 500); 
                }, i * 200);
            });
            spinPromises.push(promise);
        });

        await Promise.all(spinPromises);
        checkWin(results);
    }

    async function checkWin(results) {
        if (!resultText) return;
        const symbols = results.map(r => r.symbol);
        let pointsWon = 0;
        let resultString = '';
        let isJackpot = false;
        let isPair = false;

        const finalIcons = document.querySelectorAll('.reel-icon.bounce');

        if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
            pointsWon = results[0].points * 10;
            resultString = `JACKPOT! +${pointsWon}`;
            isJackpot = true;
            finalIcons.forEach(icon => icon.classList.add('jackpot'));
        } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
            pointsWon = results.find(r => r.symbol === (symbols[0] === symbols[1] ? symbols[0] : (symbols[0] === symbols[2] ? symbols[0] : symbols[1]))).points * 2;
            resultString = `PAIR! +${pointsWon}`;
            isPair = true;
            if (symbols[0] === symbols[1]) { finalIcons[0].classList.add('win'); finalIcons[1].classList.add('win'); }
            if (symbols[0] === symbols[2]) { finalIcons[0].classList.add('win'); finalIcons[2].classList.add('win'); }
            if (symbols[1] === symbols[2]) { finalIcons[1].classList.add('win'); finalIcons[2].classList.add('win'); }
        } else {
            results.forEach(item => pointsWon += item.points);
            resultString = `+${pointsWon} PTS`;
        }

        resultText.textContent = resultString;
        if (isJackpot) resultText.classList.add('jackpot');
        else if (isPair || pointsWon > 0) resultText.classList.add('win');

        await updateUserProfile({ points: user.points + pointsWon });
        await updateTaskProgress('earn10k', pointsWon);
        if (isJackpot) await updateTaskProgress('winJackpot');
        if (isPair) await updateTaskProgress('winPair');
        
        setTimeout(() => {
            if (shutter) shutter.classList.remove('open');
            reelInners.forEach(reelInner => {
                if (reelInner) reelInner.innerHTML = `🎰`;
            });
            isSpinning = false;
            updateAllUI();
            updateButtonStates();
            renderTasksPage();
        }, 2000);
    }

    // =================================================================
    // --- CARD FLIP GAME LOGIC ---
    // =================================================================
    
    function updateCardAdTimer() {
        if (!watchAdForCardsButton || !user.id) return;
        const now = Date.now();
        const lastClaim = user.last_card_ad_claim ? new Date(user.last_card_ad_claim).getTime() : 0;
        const cooldownEnd = lastClaim + CARD_AD_COOLDOWN;

        if (now < cooldownEnd) {
            watchAdForCardsButton.disabled = true;
            cardAdTimerEl.textContent = formatTime(cooldownEnd - now);
        } else {
            watchAdForCardsButton.disabled = false;
            cardAdTimerEl.textContent = '';
        }
    }

    function handleWatchAdForCards() {
        if (watchAdForCardsButton.disabled) return;
        watchAdForCardsButton.disabled = true;
        CardGameAdController.show().then(async () => {
            await updateUserProfile({ 
                card_chances: (user.card_chances || 0) + 5,
                last_card_ad_claim: new Date().toISOString()
            });
            updateAllUI();
            updateButtonStates();
        }).catch((error) => {
            console.error("Card game ad failed.", error);
            watchAdForCardsButton.disabled = false;
        }).finally(() => {
            updateCardAdTimer();
        });
    }
    
    async function handleBuyChances() {
        if (user.points < CARD_CHANCES_COST || buyChancesButton.disabled) return;
        buyChancesButton.disabled = true;

        await updateUserProfile({
            points: user.points - CARD_CHANCES_COST,
            card_chances: (user.card_chances || 0) + 5
        });
        updateAllUI();
        updateButtonStates();
    }

    function startCardGame() {
        if (user.card_chances <= 0 || isCardGameActive) return;
        isCardGameActive = true;
        navigateTo('card-game-page');
        setupNewRound();
    }
    
    function setupNewRound() {
        selectedCards = [];
        cardGameChancesLeftEl.textContent = user.card_chances;
        cardGameInstructionsEl.textContent = "Pick two cards...";
        
        cardGameDeck = [
            CARD_GAME_REWARDS.bomb, CARD_GAME_REWARDS.bomb,
            CARD_GAME_REWARDS.points,
            CARD_GAME_REWARDS.ton,
            CARD_GAME_REWARDS.sol
        ];
        
        for (let i = cardGameDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardGameDeck[i], cardGameDeck[j]] = [cardGameDeck[j], cardGameDeck[i]];
        }
        
        renderCards();
    }
    
    function renderCards() {
        cardDeck.innerHTML = '';
        const gridAreas = ['c1', 'c2', 'c3', 'c4', 'c5']; 
        cardGameDeck.forEach((cardData, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.index = index;
            cardEl.style.gridArea = gridAreas[index];
            cardEl.innerHTML = `
                <div class="card-face card-front">?</div>
                <div class="card-face card-back type-${cardData.type}">
                    <div class="card-icon">${cardData.icon}</div>
                    <div class="card-value">${cardData.text}</div>
                </div>
            `;
            cardEl.addEventListener('click', () => handleCardClick(cardEl));
            cardDeck.appendChild(cardEl);
        });
    }

    function handleCardClick(cardEl) {
        if (selectedCards.length >= 2 || cardEl.classList.contains('flipped')) return;
        
        cardEl.classList.add('flipped');
        selectedCards.push(cardEl);
        
        if (selectedCards.length === 1) {
            cardGameInstructionsEl.textContent = "Pick one more card...";
        }

        if (selectedCards.length === 2) {
            cardGameInstructionsEl.textContent = "Revealing results...";
            setTimeout(processRound, 1500);
        }
    }

    async function processRound() {
        const rewards = { points: 0, ton: 0, sol: 0 };
        let hitBomb = false;
        
        const card1Data = cardGameDeck[selectedCards[0].dataset.index];
        const card2Data = cardGameDeck[selectedCards[1].dataset.index];
        
        [card1Data, card2Data].forEach(card => {
            if (card.type === 'bomb') {
                hitBomb = true;
            } else if (card.type === 'points') {
                rewards.points += card.value;
            } else if (card.type === 'ton') {
                rewards.ton += card.value;
            } else if (card.type === 'sol') {
                rewards.sol += card.value;
            }
        });

        document.querySelectorAll('.card:not(.flipped)').forEach(c => c.classList.add('flipped'));

        let profileUpdate = { card_chances: user.card_chances - 1 };
        
        if (!hitBomb) {
            profileUpdate.points = (user.points || 0) + rewards.points;
            profileUpdate.ton_balance = (parseFloat(user.ton_balance) || 0) + rewards.ton;
            profileUpdate.sol_balance = (parseFloat(user.sol_balance) || 0) + rewards.sol;
        }

        await updateUserProfile(profileUpdate);
        
        showRoundResults(rewards, hitBomb);
    }

    function showRoundResults(rewards, hitBomb) {
        if (hitBomb) {
            cardGameResultTitle.textContent = "💣 You Hit a Bomb! 💣";
            cardGameRewardsList.innerHTML = `<p class="reward-lose">No rewards this round.</p>`;
        } else {
            cardGameResultTitle.textContent = "🎉 Rewards Earned! 🎉";
            let rewardsHtml = '';
            if (rewards.points > 0) rewardsHtml += `<p class="reward-win">+${rewards.points} Points</p>`;
            if (rewards.ton > 0) rewardsHtml += `<p class="reward-win">+${rewards.ton.toFixed(5)} TON</p>`;
            if (rewards.sol > 0) rewardsHtml += `<p class="reward-win">+${rewards.sol.toFixed(6)} SOL</p>`;
            if (rewardsHtml === '') rewardsHtml = `<p>No rewards found this round.</p>`;
            cardGameRewardsList.innerHTML = rewardsHtml;
        }

        setTimeout(() => {
            cardGameResultsModal.classList.remove('hidden');
            isCardGameActive = false;
            updateAllUI();
            updateButtonStates();
        }, 1000);
    }
    
    // =================================================================
    // --- WALLET/PROFILE/EVENTS FUNCTIONS ---
    // =================================================================
    async function checkWithdrawalGate() { 
        if (!userCountProgress || !userProgressBarInner || !withdrawalGateNotice || !withdrawalFieldset) return;
        const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); 
        if (error) { console.error("Could not fetch user count:", error); return; } 
        totalUserCount = count; 
        const progressPercent = Math.min(100, (totalUserCount / WITHDRAWAL_USER_GATE) * 100); 
        userCountProgress.textContent = `${totalUserCount.toLocaleString()} / ${WITHDRAWAL_USER_GATE.toLocaleString()} Players`; 
        userProgressBarInner.style.width = `${progressPercent}%`; 
        if (totalUserCount >= WITHDRAWAL_USER_GATE) { 
            withdrawalGateNotice.classList.add('hidden'); 
            withdrawalFieldset.disabled = false; 
        } else { 
            withdrawalGateNotice.classList.remove('hidden'); 
            withdrawalFieldset.disabled = true; 
        } 
    }
    async function handleExchange() { const pointsToExchange = parseInt(pointsToExchangeInput.value, 10); const selectedCrypto = exchangeCryptoSelect.value; if (isNaN(pointsToExchange) || pointsToExchange <= 0) return showFeedback(exchangeFeedbackEl, "Please enter a valid number.", "error"); if (pointsToExchange > user.points) return showFeedback(exchangeFeedbackEl, "You do not have enough points.", "error"); if (pointsToExchange % POINTS_PER_BLOCK !== 0) return showFeedback(exchangeFeedbackEl, `Exchange in blocks of ${POINTS_PER_BLOCK.toLocaleString()}.`, "error"); const blocks = pointsToExchange / POINTS_PER_BLOCK; let profileUpdate = { points: user.points - pointsToExchange }; let feedbackMessage = ''; if (selectedCrypto === 'ton') { const tonGained = blocks * TON_PER_BLOCK; profileUpdate.ton_balance = parseFloat(user.ton_balance) + tonGained; feedbackMessage = `Exchanged for ${tonGained.toFixed(2)} TON!`; } else if (selectedCrypto === 'sol') { const solGained = blocks * SOL_PER_BLOCK; profileUpdate.sol_balance = parseFloat(user.sol_balance) + solGained; feedbackMessage = `Exchanged for ${solGained.toFixed(4)} SOL!`; } await updateUserProfile(profileUpdate); await supabase.from('transaction_logs').insert({ user_id: user.id, transaction_type: 'exchange', points_exchanged: pointsToExchange, currency: selectedCrypto.toUpperCase(), status: 'completed' }); updateAllUI(); pointsToExchangeInput.value = ''; showFeedback(exchangeFeedbackEl, feedbackMessage, "success"); }
    async function handleWithdraw() { const currency = cryptoSelect.value; const amount = parseFloat(withdrawalAmountInput.value); const address = walletAddressInput.value.trim(); if (isNaN(amount) || amount <= 0) return showFeedback(withdrawalFeedbackEl, "Please enter a valid amount.", "error"); if (address === '') return showFeedback(withdrawalFeedbackEl, "Please enter a wallet address.", "error"); let newBalance; const fee = amount * (WITHDRAWAL_FEE_PERCENT / 100); const amountAfterFee = amount - fee; if (currency === 'ton') { if (amount < MIN_TON_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum TON withdrawal is ${MIN_TON_WITHDRAWAL}.`, "error"); if (amount > user.ton_balance) return showFeedback(withdrawalFeedbackEl, `Insufficient TON balance.`, "error"); newBalance = { ton_balance: parseFloat(user.ton_balance) - amount }; } else if (currency === 'sol') { if (amount < MIN_SOL_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum SOL withdrawal is ${MIN_SOL_WITHDRAWAL}.`, "error"); if (amount > user.sol_balance) return showFeedback(withdrawalFeedbackEl, `Insufficient SOL balance.`, "error"); newBalance = { sol_balance: parseFloat(user.sol_balance) - amount }; } await updateUserProfile(newBalance); await supabase.from('transaction_logs').insert({ user_id: user.id, transaction_type: 'withdrawal', currency: currency.toUpperCase(), amount: amountAfterFee, withdrawal_address: address, status: 'pending' }); updateAllUI(); withdrawalAmountInput.value = ''; walletAddressInput.value = ''; showFeedback(withdrawalFeedbackEl, `Request for ${amount} ${currency.toUpperCase()} submitted. You will receive ~${amountAfterFee.toFixed(4)} after fees.`, "success"); fetchAndRenderWithdrawalHistory(); }
    async function handleHistoryToggle(event) { if (event.target.open) await fetchAndRenderWithdrawalHistory(); }
    async function fetchAndRenderWithdrawalHistory() { if (!withdrawalHistoryContainer) return; withdrawalHistoryContainer.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>'; const { data, error } = await supabase.from('transaction_logs').select('*').eq('user_id', user.id).eq('transaction_type', 'withdrawal').order('created_at', { ascending: false }); if (error) { withdrawalHistoryContainer.innerHTML = '<p class="placeholder-text error-text">Could not load history.</p>'; return; } if (data.length === 0) { withdrawalHistoryContainer.innerHTML = '<p class="placeholder-text">No withdrawal history yet.</p>'; return; } withdrawalHistoryContainer.innerHTML = data.map(tx => `<div class="history-item"><div class="history-details"><p>Amount: <strong>${tx.amount.toFixed(4)} ${tx.currency}</strong></p><p class="history-address">To: ${tx.withdrawal_address}</p></div><div class="history-status ${tx.status}">${tx.status}</div><div class="history-date">${new Date(tx.created_at).toLocaleString()}</div></div>`).join(''); }
    async function handleLeaderboardToggle(event) { if (event.target.open) await fetchAndRenderLeaderboard(); }
    async function fetchAndRenderLeaderboard() { 
        const targetList = document.querySelector("#profile-page .leaderboard-container");
        if (!targetList) return; 
        targetList.innerHTML = '<div class="spinner" style="margin: 20px auto; border-color: var(--theme-border); border-top-color: var(--theme-glow);"></div>'; 
        const { data, error } = await supabase.from('profiles').select('full_name, points').order('points', { ascending: false }).limit(100); 
        if (error) { targetList.innerHTML = '<p class="placeholder-text error-text">Could not load leaderboard.</p>'; return; } 
        if (data.length === 0) { targetList.innerHTML = '<p class="placeholder-text">Leaderboard is empty.</p>'; return; } 
        targetList.innerHTML = data.map((player, index) => `
            <div class="leaderboard-item">
                <span class="leaderboard-rank">#${index + 1}</span>
                <div class="leaderboard-avatar">🧑‍🚀</div>
                <span class="leaderboard-name">${player.full_name}</span>
                <div class="leaderboard-points-pill">
                    <span class="leaderboard-points">💎 ${Math.floor(player.points).toLocaleString()}</span>
                </div>
            </div>`).join(''); 
    }

    function animateCountUp(el, endValue) {
        if (!el) return;
        const startValue = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
        const duration = 1500;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
            el.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = endValue.toLocaleString();
            }
        }
        window.requestAnimationFrame(step);
    }

    async function fetchAndRenderEventStats() {
        if (!totalUsersValueEl || !totalPointsValueEl) return;
        totalUsersValueEl.textContent = '0';
        totalPointsValueEl.textContent = '0';

        const { count, error: countError } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        if (countError) {
            totalUsersValueEl.textContent = 'Error';
        } else {
            animateCountUp(totalUsersValueEl, count);
        }

        const { data: totalPoints, error: rpcError } = await supabase.rpc('get_total_points');
        if (rpcError) {
            totalPointsValueEl.textContent = 'Error';
        } else {
            animateCountUp(totalPointsValueEl, Math.floor(totalPoints));
        }
    }

    // --- START THE APP ---
    main().catch(error => { 
        console.error("Failed to initialize the app:", error); 
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `<p style="color: var(--error-color); text-align: center;">Failed to load game data.<br>Please try again later.<br><small>${error.message}</small></p>`; 
        }
    });
});
