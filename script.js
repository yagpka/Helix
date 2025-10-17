document.addEventListener('DOMContentLoaded', async () => {
    // --- All DOM element selectors ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const appContainer = document.querySelector('.app-container');
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');
    const profileButton = document.getElementById('profile-button');
    const pointsValueTop = document.getElementById('points-value');
    const profileNameEl = document.getElementById('profile-name');
    const profileUsernameEl = document.getElementById('profile-username');
    const profilePointsEl = document.getElementById('profile-points-value');
    const pullsAmountEl = document.getElementById('currency-amount');
    const pullButton = document.getElementById('pull-button');
    const watchAdButton = document.getElementById('watch-ad-button');
    const resultText = document.getElementById('result-text');
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
    const streakContainer = document.getElementById('streak-container');
    const tasksContainer = document.getElementById('tasks-container');
    const historyDetails = document.getElementById('history-details');
    const withdrawalHistoryContainer = document.getElementById('withdrawal-history-container');
    const closeProfileButton = document.getElementById('close-profile-button');
    const leaderboardDetails = document.getElementById('leaderboard-details');
    const leaderboardList = document.getElementById('leaderboard-list');
    const totalUsersValueEl = document.getElementById('total-users-value');
    const totalPointsValueEl = document.getElementById('total-points-value');
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
    const gachaAnimationScreen = document.getElementById('gacha-animation-screen');
    const animationReelsContainer = document.getElementById('animation-reels-container');
    const particleContainer = document.getElementById('particle-container');
    const animationResultDisplay = document.getElementById('animation-result-display');
    const animationPointsWon = document.getElementById('animation-points-won');
    const wheelNavButton = document.getElementById('wheel-nav-button');
    const wheelElement = document.getElementById('wheel');
    const spinWheelButton = document.getElementById('spin-wheel-button');
    const wheelResultText = document.getElementById('wheel-result-text');

    // =================================================================
    // --- SUPABASE & SDK INITIALIZATION ---
    // =================================================================
    const SUPABASE_URL = 'https://vddnlobgtnwwplburlja.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZG5sb2JndG53d3BsYnVybGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDEyMTcsImV4cCI6MjA3NTUxNzIxN30.2zYyICX5QyNDcLcGWia1F04yXPfNH6M09aczNlsLFSM';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const AdController = window.Adsgram ? window.Adsgram.init({ blockId: "int-14190" }) : null;
    const TreasureAdController = window.Adsgram ? window.Adsgram.init({ blockId: "int-15943" }) : null;
    const TicketAdController = window.Adsgram ? window.Adsgram.init({ blockId: "int-15944" }) : null;

    // =================================================================
    // --- CONFIGURATIONS & CONSTANTS ---
    // =================================================================
    const GACHA_ITEMS = [ { symbol: '🍓', points: 5 }, { symbol: '🍌', points: 10 }, { symbol: '🍊', points: 15 }, { symbol: '🍉', points: 20 }, { symbol: '🥑', points: 25 }, { symbol: '🌶️', points: 30 }, { symbol: '🍇', points: 35 }, { symbol: '💎', points: 40 } ];
    const WHEEL_PRIZES = [ { type: 'points', value: 5000, label: '5K PTS' }, { type: 'pulls', value: 10, label: '10 PULLS' }, { type: 'points', value: 10000, label: '10K PTS' }, { type: 'pulls', value: 25, label: '25 PULLS' }, { type: 'points', value: 25000, label: '25K PTS' }, { type: 'pulls', value: 5, label: '5 PULLS' }, { type: 'points', value: 7500, label: '7.5K PTS' }, { type: 'pulls', value: 50, label: 'JACKPOT' } ];
    const WHEEL_SPIN_COST = 1000;
    const ANIMATION_REEL_CONFIG = { iconCount: 40, spinDuration: 1000, staggerDelay: 500 };
    const POINTS_PER_BLOCK = 1000000; const TON_PER_BLOCK = 0.3; const SOL_PER_BLOCK = 0.0038; const WITHDRAWAL_FEE_PERCENT = 5; const MIN_TON_WITHDRAWAL = 1; const MIN_SOL_WITHDRAWAL = 0.01; const WITHDRAWAL_USER_GATE = 1000; const STREAK_REWARDS = [ { day: 1, points: 2000, pulls: 3 }, { day: 2, points: 4000, pulls: 5 }, { day: 3, points: 6000, pulls: 7 }, { day: 4, points: 8000, pulls: 9 }, { day: 5, points: 10000, pulls: 10 }, { day: 6, points: 10000, pulls: 11 }, { day: 7, points: 10000, pulls: 12 } ]; const DAILY_TASK_KEYS = ['pull10', 'watch2', 'winPair', 'earn10k', 'winJackpot']; const TREASURE_COOLDOWN = 3 * 60 * 1000; const TREASURE_REWARD_POINTS = 2000; const TICKET_COOLDOWN = 5 * 60 * 1000; const TICKET_REWARD_PULLS = 6;
    
    // --- STATE MANAGEMENT ---
    let user = {}; let tasks = {}; let taskProgress = {}; let isSpinning = false; let isWheelSpinning = false; let totalUserCount = 0;
    
    // =================================================================
    // --- INITIALIZATION ---
    // =================================================================

    const main = async () => {
        setupEventListeners();
        buildAnimationReels();
        buildFortuneWheel();

        const TWA = window.Telegram.WebApp;
        if (!TWA || !TWA.initDataUnsafe?.user) {
            loadingOverlay.innerHTML = `<p style="color: var(--error-color); text-align: center;">This app must be run inside Telegram.</p>`;
            console.error("Telegram Web App user data not found. App cannot start.");
            return; // Halt execution if not in Telegram
        }
        
        TWA.ready(); 
        TWA.expand();
        document.body.style.setProperty('--bg-color', TWA.themeParams.bg_color || '#0F0F1A');
        const telegramUser = TWA.initDataUnsafe.user;
        
        await loadInitialData(telegramUser);
        await Promise.all([checkDailyResets(), checkWithdrawalGate()]);
        
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
        if (!profileData) { const { data: newUser, error: createError } = await supabase.from('profiles').insert({ telegram_id: telegramUser.id, username: telegramUser.username ? '@' + telegramUser.username : 'No Username', full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(), points: 1250, pulls: 20 }).select().single(); if (createError) throw new Error(`Could not create profile: ${createError.message}`); profileData = newUser; }
        user = profileData;
        const today = getTodayDateString();
        const [taskDefsResult, progressResult] = await Promise.all([ supabase.from('tasks').select('*'), supabase.from('user_task_progress').select('*').eq('user_id', user.id).eq('date', today) ]);
        if (taskDefsResult.error) throw new Error('Could not fetch task definitions'); if (progressResult.error) throw new Error('Could not fetch task progress');
        tasks = taskDefsResult.data.reduce((acc, task) => { acc[task.id] = task; return acc; }, {});
        const progressByTaskId = progressResult.data.reduce((acc, p) => { acc[p.task_id] = p; return acc; }, {});
        taskProgress = {};
        for (const taskId in tasks) { const task = tasks[taskId]; taskProgress[task.task_key] = progressByTaskId[taskId] || { current_progress: 0, is_claimed: false }; }
    };
    
    async function updateUserProfile(updateData) { const oldPoints = user.points; Object.assign(user, updateData); const { data: updatedUser, error } = await supabase.from('profiles').update(updateData).eq('id', user.id).select().single(); if (error) console.error("Error updating profile:", error); else user = updatedUser; if (updateData.points && updateData.points > oldPoints) { animatePointsDisplay(oldPoints, user.points); } else { updateAllUI(); } }
    async function updateTaskProgress(taskKey, incrementValue = 1) { const taskDef = Object.values(tasks).find(t => t.task_key === taskKey); if (!taskDef) return; const currentProg = taskProgress[taskKey]?.current_progress || 0; const newProgress = currentProg + incrementValue; taskProgress[taskKey].current_progress = newProgress; await supabase.from('user_task_progress').upsert({ user_id: user.id, task_id: taskDef.id, date: getTodayDateString(), current_progress: newProgress }, { onConflict: 'user_id, task_id, date' }); }
    
    // =================================================================
    // --- UI, SOUND & EVENT LISTENERS ---
    // =================================================================
    
    function playTapSound() { if (tapSound) { tapSound.currentTime = 0; tapSound.play().catch(e => {}); } }
    function playBGM() { if (backgroundMusic) { backgroundMusic.volume = 0.3; backgroundMusic.play().catch(() => { document.body.addEventListener('click', () => backgroundMusic.play(), { once: true }); }); } }

    function setupEventListeners() {
        document.querySelectorAll('button, details > summary, .nav-button, .profile-icon').forEach(el => { el.addEventListener('click', playTapSound); });
        navButtons.forEach(button => button.addEventListener('click', () => navigateTo(button.dataset.page)));
        profileButton.addEventListener('click', () => navigateTo('profile-page'));
        pullButton.addEventListener('click', handlePull);
        watchAdButton.addEventListener('click', handleWatchAd);
        exchangeButton.addEventListener('click', handleExchange);
        withdrawButton.addEventListener('click', handleWithdraw);
        treasureBtnFloat.addEventListener('click', handleClaimTreasure);
        ticketBtnFloat.addEventListener('click', handleClaimTickets);
        historyDetails.addEventListener('toggle', handleHistoryToggle);
        closeProfileButton.addEventListener('click', () => navigateTo('home-page'));
        leaderboardDetails.addEventListener('toggle', handleLeaderboardToggle);
        closeAnnouncementButton.addEventListener('click', () => announcementModal.classList.add('hidden'));
        shareGameButton.addEventListener('click', () => { const TWA = window.Telegram.WebApp; if (TWA && TWA.switchInlineQuery) TWA.switchInlineQuery('Come play YTD Gacha Game!'); else alert("Share feature is available only within Telegram."); });
        wheelNavButton.addEventListener('click', () => navigateTo('wheel-page'));
        spinWheelButton.addEventListener('click', handleSpinWheel);
    }

    function handleAnnouncement() { announcementModal.classList.remove('hidden'); }
    
    function navigateTo(pageId) {
        if (document.getElementById(pageId).classList.contains('active')) return;
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        navButtons.forEach(button => button.classList.toggle('active', button.dataset.page === pageId));
        wheelNavButton.classList.toggle('hidden', pageId !== 'home-page' && pageId !== 'wheel-page');
        if (pageId === 'tasks-page') renderTasksPage();
        if (pageId === 'wallet-page') { fetchAndRenderWithdrawalHistory(); checkWithdrawalGate(); }
        if (pageId === 'events-page') fetchAndRenderEventStats();
    }
    
    function updateAllUI() { if (!user || !user.id) return; pointsValueTop.textContent = Math.floor(user.points).toLocaleString(); profileNameEl.textContent = user.full_name; profileUsernameEl.textContent = user.username; profilePointsEl.textContent = Math.floor(user.points).toLocaleString(); pullsAmountEl.textContent = user.pulls; tonBalanceEl.textContent = parseFloat(user.ton_balance).toFixed(2); solBalanceEl.textContent = parseFloat(user.sol_balance).toFixed(4); }
    function updateButtonStates() { if (isSpinning || !user?.id) return; if (user.pulls > 0) { pullButton.disabled = false; watchAdButton.disabled = true; resultText.textContent = "PULL THE LEVER!"; } else { pullButton.disabled = true; watchAdButton.disabled = false; resultText.textContent = "WATCH AD TO PLAY"; } }
    async function checkDailyResets() { const today = getTodayDateString(); const lastClaimDateStr = user.last_streak_claim_date; if (lastClaimDateStr && lastClaimDateStr !== today) { const lastClaimDate = new Date(lastClaimDateStr); const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); if (lastClaimDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0]) { await updateUserProfile({ daily_streak: 0 }); } } }
    function getTodayDateString() { return new Date().toISOString().split('T')[0]; }
    function renderTasksPage() { renderDailyStreak(); renderDailyTasks(); }
    function renderDailyStreak() { streakContainer.innerHTML = ''; const today = getTodayDateString(); STREAK_REWARDS.forEach(reward => { const isClaimed = user.daily_streak >= reward.day; const isClaimable = user.daily_streak + 1 === reward.day && user.last_streak_claim_date !== today; const itemEl = document.createElement('div'); itemEl.className = 'streak-item'; if (isClaimable) itemEl.classList.add('active'); if (isClaimed) itemEl.classList.add('claimed'); let rewardString = ''; if (reward.points) rewardString += `<strong>+${reward.points.toLocaleString()}</strong> Points`; if (reward.points && reward.pulls) rewardString += ' & '; if (reward.pulls) rewardString += `<strong>+${reward.pulls}</strong> Pulls`; let buttonText = 'Locked'; let buttonClass = ''; if (isClaimable) { buttonText = 'Claim'; buttonClass = 'claimable'; } if (isClaimed) { buttonText = 'Claimed'; buttonClass = 'claimed'; } itemEl.innerHTML = `<div class="streak-info"><h3>Day ${reward.day}</h3><p>${rewardString}</p></div><button class="streak-claim-button ${buttonClass}" ${!isClaimable ? 'disabled' : ''}>${buttonText}</button>`; if (isClaimable) { itemEl.querySelector('button').onclick = (e) => claimStreakReward(reward.day, e.currentTarget); } streakContainer.appendChild(itemEl); }); }
    function renderDailyTasks() { tasksContainer.innerHTML = ''; if (Object.keys(tasks).length === 0) { tasksContainer.innerHTML = '<p class="placeholder-text">Loading tasks...</p>'; return; } DAILY_TASK_KEYS.forEach(taskKey => { const taskDef = Object.values(tasks).find(t => t.task_key === taskKey); if (!taskDef) return; const progress = taskProgress[taskKey]?.current_progress || 0; const isClaimed = taskProgress[taskKey]?.is_claimed || false; const isComplete = progress >= taskDef.target_value; let rewardText = taskDef.reward_type === 'points' ? `+${taskDef.reward_amount.toLocaleString()} PTS` : `+${taskDef.reward_amount} Pulls`; const taskEl = document.createElement('div'); taskEl.className = 'task-item'; taskEl.innerHTML = `<div class="task-info"><p>${taskDef.description} (${progress}/${taskDef.target_value})</p><div class="progress-bar"><div class="progress-bar-inner" style="width: ${Math.min(100, (progress / taskDef.target_value) * 100)}%;"></div></div></div><div class="task-reward">${rewardText}</div><button class="claim-button" data-task-key="${taskDef.task_key}" ${(!isComplete || isClaimed) ? 'disabled' : ''}>${isClaimed ? 'Claimed' : 'Claim'}</button>`; tasksContainer.appendChild(taskEl); }); tasksContainer.querySelectorAll('.claim-button').forEach(button => button.addEventListener('click', (e) => claimTaskReward(e.currentTarget.dataset.taskKey))); }
    function showFeedback(element, message, type) { element.textContent = message; element.className = `feedback-message ${type} show`; setTimeout(() => { element.classList.remove('show'); }, 4000); }
    
    // --- GAME ACTIONS ---
    function initializeTimedRewards() { setInterval(updateTimedRewards, 1000); updateTimedRewards(); }
    function updateTimedRewards() { const now = Date.now(); const lastTreasureClaim = user.last_treasure_claim ? new Date(user.last_treasure_claim).getTime() : 0; const treasureCooldownEnd = lastTreasureClaim + TREASURE_COOLDOWN; if (now < treasureCooldownEnd) { treasureTimerFloat.textContent = formatTime(treasureCooldownEnd - now); treasureBtnFloat.disabled = true; } else { treasureTimerFloat.textContent = ''; treasureBtnFloat.disabled = false; } const lastTicketClaim = user.last_ticket_claim ? new Date(user.last_ticket_claim).getTime() : 0; const ticketCooldownEnd = lastTicketClaim + TICKET_COOLDOWN; if (now < ticketCooldownEnd) { ticketTimerFloat.textContent = formatTime(ticketCooldownEnd - now); ticketBtnFloat.disabled = true; } else { ticketTimerFloat.textContent = ''; ticketBtnFloat.disabled = false; } }
    function formatTime(ms) { const totalSeconds = Math.ceil(ms / 1000); const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }
    
    async function handleClaimTreasure() { if (treasureBtnFloat.disabled || !TreasureAdController) return; treasureBtnFloat.disabled = true; try { await TreasureAdController.show(); await updateUserProfile({ points: user.points + TREASURE_REWARD_POINTS, last_treasure_claim: new Date().toISOString() }); } catch (e) { console.error("Treasure ad failed.", e); } finally { updateTimedRewards(); } }
    async function handleClaimTickets() { if (ticketBtnFloat.disabled || !TicketAdController) return; ticketBtnFloat.disabled = true; try { await TicketAdController.show(); await updateUserProfile({ pulls: user.pulls + TICKET_REWARD_PULLS, last_ticket_claim: new Date().toISOString() }); updateButtonStates(); } catch (e) { console.error("Ticket ad failed.", e); } finally { updateTimedRewards(); } }
    async function claimStreakReward(day, button) { const today = getTodayDateString(); if (user.last_streak_claim_date === today || user.daily_streak + 1 !== day) return; const reward = STREAK_REWARDS.find(r => r.day === day); await updateUserProfile({ daily_streak: user.daily_streak + 1, last_streak_claim_date: today, points: user.points + (reward.points || 0), pulls: user.pulls + (reward.pulls || 0) }); updateButtonStates(); renderTasksPage(); }
    async function claimTaskReward(taskKey) { const progressData = taskProgress[taskKey]; if (!progressData || progressData.is_claimed) return; const taskDef = Object.values(tasks).find(t => t.task_key === taskKey); if (progressData.current_progress >= taskDef.target_value) { let profileUpdate = {}; if (taskDef.reward_type === 'points') profileUpdate.points = user.points + taskDef.reward_amount; else if (taskDef.reward_type === 'pulls') profileUpdate.pulls = user.pulls + taskDef.reward_amount; await updateUserProfile(profileUpdate); progressData.is_claimed = true; await supabase.from('user_task_progress').update({ is_claimed: true }).match({ user_id: user.id, task_id: taskDef.id, date: getTodayDateString() }); updateButtonStates(); renderTasksPage(); } }
    function handleWatchAd() { if (!AdController) { showFeedback(resultText, "Ad service not available.", "error"); return; } watchAdButton.disabled = true; watchAdButton.textContent = "LOADING AD..."; AdController.show().then(async () => { await updateUserProfile({ pulls: user.pulls + 10 }); await updateTaskProgress('watch2'); updateButtonStates(); resultText.textContent = "YOU GOT 10 PULLS!"; }).catch(() => { resultText.textContent = "AD FAILED. NO REWARD."; }).finally(() => { watchAdButton.disabled = false; watchAdButton.textContent = "WATCH AD FOR 10 PULLS"; updateButtonStates(); renderTasksPage(); }); }
    
    // --- GACHA ANIMATION SYSTEM ---
    async function handlePull() { if (user.pulls <= 0 || isSpinning) return; isSpinning = true; await updateUserProfile({ points: user.points - 1 }); await updateTaskProgress('pull10'); pullButton.disabled = true; watchAdButton.disabled = true; resultText.textContent = 'GET READY...'; if(spinSound) { spinSound.currentTime = 0; spinSound.play().catch(e => {}); } resetAnimationState(); appContainer.classList.add('hidden'); gachaAnimationScreen.classList.remove('hidden'); const reels = Array.from(document.querySelectorAll('.animation-reel-inner')); for (const reel of reels) { reel.classList.add('spinning'); reel.style.transform = `translateY(-${reel.scrollHeight / 1.5}px)`; } await new Promise(resolve => setTimeout(resolve, ANIMATION_REEL_CONFIG.spinDuration)); const stopPromises = reels.map((reel, i) => new Promise(resolve => { setTimeout(() => { resolve(stopAnimationReel(reel)); }, i * ANIMATION_REEL_CONFIG.staggerDelay); })); const finalResults = await Promise.all(stopPromises); await checkWin(finalResults); }
    function stopAnimationReel(reel) { return new Promise(resolve => { reel.classList.remove('spinning'); const iconHeight = reel.querySelector('.animation-reel-icon').offsetHeight; const iconCount = ANIMATION_REEL_CONFIG.iconCount; const randomIndex = Math.floor(Math.random() * iconCount); const screenCenterOffset = (gachaAnimationScreen.offsetHeight - iconHeight) / 2; const finalPosition = (randomIndex * iconHeight) - screenCenterOffset; reel.style.transform = `translateY(-${finalPosition}px)`; reel.addEventListener('transitionend', () => { reel.classList.add('stopped'); const winnerIcon = reel.children[randomIndex]; if (winnerIcon) winnerIcon.classList.add('winner'); const symbol = winnerIcon.textContent; const points = GACHA_ITEMS.find(item => item.symbol === symbol).points; resolve({ symbol, points }); }, { once: true }); }); }
    async function checkWin(results) { const symbols = results.map(r => r.symbol); let pointsWon = 0, resultString = '', isJackpot = false, isPair = false; if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) { pointsWon = results[0].points * 10; resultString = `JACKPOT! +${pointsWon}`; isJackpot = true; } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) { const pairSymbol = symbols[0] === symbols[1] ? symbols[0] : (symbols[0] === symbols[2] ? symbols[0] : symbols[1]); pointsWon = results.find(r => r.symbol === pairSymbol).points * 2; resultString = `PAIR! +${pointsWon}`; isPair = true; } else { results.forEach(item => pointsWon += item.points); resultString = `+${pointsWon} PTS`; } await updateUserProfile({ points: user.points + pointsWon }); await updateTaskProgress('earn10k', pointsWon); if (isJackpot) await updateTaskProgress('winJackpot'); if (isPair) await updateTaskProgress('winPair'); createParticleBurst(); animatePointsWon(pointsWon); animationResultDisplay.classList.remove('hidden'); animationPointsWon.classList.add('animate'); setTimeout(() => exitGachaAnimation(resultString, isJackpot, isPair), 3000); }
    function exitGachaAnimation(finalResultString, isJackpot, isPair) { gachaAnimationScreen.classList.add('exiting'); setTimeout(() => { gachaAnimationScreen.classList.add('hidden'); appContainer.classList.remove('hidden'); resultText.textContent = finalResultString; resultText.classList.remove('win', 'jackpot'); if (isJackpot) resultText.classList.add('jackpot'); else resultText.classList.add('win'); isSpinning = false; updateButtonStates(); renderTasksPage(); }, 400); }
    function buildAnimationReels() { animationReelsContainer.innerHTML = ''; for (let i = 0; i < 3; i++) { const reel = document.createElement('div'); reel.className = 'animation-reel'; const reelInner = document.createElement('div'); reelInner.className = 'animation-reel-inner'; const iconPool = []; for (let j = 0; j < ANIMATION_REEL_CONFIG.iconCount; j++) { iconPool.push(GACHA_ITEMS[Math.floor(Math.random() * GACHA_ITEMS.length)]); } const allIcons = [...iconPool, ...iconPool]; allIcons.forEach(item => { const iconDiv = document.createElement('div'); iconDiv.className = 'animation-reel-icon'; iconDiv.textContent = item.symbol; reelInner.appendChild(iconDiv); }); reel.appendChild(reelInner); animationReelsContainer.appendChild(reel); } }
    function resetAnimationState() { gachaAnimationScreen.classList.remove('exiting'); particleContainer.innerHTML = ''; animationResultDisplay.classList.add('hidden'); animationPointsWon.classList.remove('animate'); animationPointsWon.textContent = ''; document.querySelectorAll('.animation-reel-inner').forEach(reel => { reel.classList.remove('stopped', 'spinning'); reel.style.transition = 'none'; reel.style.transform = 'translateY(0)'; reel.offsetHeight; reel.style.transition = ''; Array.from(reel.children).forEach(icon => icon.classList.remove('winner')); }); }
    function animatePointsWon(endValue) { let startValue = 0; const duration = 1000; const startTime = Date.now(); function updateFrame() { const elapsedTime = Date.now() - startTime; if (elapsedTime >= duration) { animationPointsWon.textContent = `+${endValue.toLocaleString()} Points!`; return; } const currentValue = Math.round(endValue * (elapsedTime / duration)); animationPointsWon.textContent = `+${currentValue.toLocaleString()} Points!`; requestAnimationFrame(updateFrame); } requestAnimationFrame(updateFrame); }
    function createParticleBurst() { for (let i = 0; i < 30; i++) { const p = document.createElement('div'); p.className = 'particle'; const angle = Math.random() * 360; const radius = Math.random() * 150 + 50; p.style.setProperty('--x', `${Math.cos(angle * Math.PI/180) * radius}px`); p.style.setProperty('--y', `${Math.sin(angle * Math.PI/180) * radius}px`); particleContainer.appendChild(p); } }
    function animatePointsDisplay(start, end) { const duration = 500; const startTime = Date.now(); function frame() { const elapsed = Date.now() - startTime; if (elapsed >= duration) { pointsValueTop.textContent = Math.floor(end).toLocaleString(); return; } const value = start + (end - start) * (elapsed / duration); pointsValueTop.textContent = Math.floor(value).toLocaleString(); requestAnimationFrame(frame); } requestAnimationFrame(frame); }

    // --- NEW WHEEL OF FORTUNE LOGIC ---
    function buildFortuneWheel() { const segmentAngle = 360 / WHEEL_PRIZES.length; wheelElement.innerHTML = WHEEL_PRIZES.map((prize, i) => `<div class="wheel-segment" style="transform: rotate(${i * segmentAngle}deg);"><div class="icon">${prize.label}</div></div>`).join(''); }
    async function handleSpinWheel() { if (isWheelSpinning || user.points < WHEEL_SPIN_COST) { showFeedback(wheelResultText, user.points < WHEEL_SPIN_COST ? "Not enough points!" : "Already spinning!", "error"); return; } isWheelSpinning = true; spinWheelButton.disabled = true; await updateUserProfile({ points: user.points - WHEEL_SPIN_COST }); if(spinSound) { spinSound.currentTime = 0; spinSound.play().catch(e => {}); } const segmentAngle = 360 / WHEEL_PRIZES.length; const randomIndex = Math.floor(Math.random() * WHEEL_PRIZES.length); const prize = WHEEL_PRIZES[randomIndex]; const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8); const targetRotation = (360 * 5) - (randomIndex * segmentAngle) - randomOffset; wheelElement.style.transform = `rotate(${targetRotation}deg)`; setTimeout(async () => { let profileUpdate = {}; let feedbackMessage = ""; if (prize.type === 'points') { profileUpdate.points = user.points + prize.value; feedbackMessage = `You won ${prize.value.toLocaleString()} Points!`; } else { profileUpdate.pulls = user.pulls + prize.value; feedbackMessage = `You won ${prize.value} Pulls!`; } await updateUserProfile(profileUpdate); showFeedback(wheelResultText, feedbackMessage, "success"); isWheelSpinning = false; spinWheelButton.disabled = false; updateButtonStates(); }, 6000); }

    // --- WALLET/PROFILE/EVENTS FUNCTIONS (Unchanged) ---
    async function checkWithdrawalGate() { const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); if (error) { console.error("Could not fetch user count:", error); return; } totalUserCount = count; const progressPercent = Math.min(100, (totalUserCount / WITHDRAWAL_USER_GATE) * 100); userCountProgress.textContent = `${totalUserCount.toLocaleString()} / ${WITHDRAWAL_USER_GATE.toLocaleString()} Players`; userProgressBarInner.style.width = `${progressPercent}%`; if (totalUserCount >= WITHDRAWAL_USER_GATE) { withdrawalGateNotice.classList.add('hidden'); withdrawalFieldset.disabled = false; } else { withdrawalGateNotice.classList.remove('hidden'); withdrawalFieldset.disabled = true; } }
    async function handleExchange() { const pointsToExchange = parseInt(pointsToExchangeInput.value, 10); const selectedCrypto = exchangeCryptoSelect.value; if (isNaN(pointsToExchange) || pointsToExchange <= 0) return showFeedback(exchangeFeedbackEl, "Please enter a valid number.", "error"); if (pointsToExchange > user.points) return showFeedback(exchangeFeedbackEl, "You do not have enough points.", "error"); if (pointsToExchange % POINTS_PER_BLOCK !== 0) return showFeedback(exchangeFeedbackEl, `Exchange in blocks of ${POINTS_PER_BLOCK.toLocaleString()}.`, "error"); const blocks = pointsToExchange / POINTS_PER_BLOCK; let profileUpdate = { points: user.points - pointsToExchange }; let feedbackMessage = ''; if (selectedCrypto === 'ton') { const tonGained = blocks * TON_PER_BLOCK; profileUpdate.ton_balance = parseFloat(user.ton_balance) + tonGained; feedbackMessage = `Exchanged for ${tonGained.toFixed(2)} TON!`; } else if (selectedCrypto === 'sol') { const solGained = blocks * SOL_PER_BLOCK; profileUpdate.sol_balance = parseFloat(user.sol_balance) + solGained; feedbackMessage = `Exchanged for ${solGained.toFixed(4)} SOL!`; } await updateUserProfile(profileUpdate); await supabase.from('transaction_logs').insert({ user_id: user.id, transaction_type: 'exchange', points_exchanged: pointsToExchange, currency: selectedCrypto.toUpperCase(), status: 'completed' }); pointsToExchangeInput.value = ''; showFeedback(exchangeFeedbackEl, feedbackMessage, "success"); }
    async function handleWithdraw() { const currency = cryptoSelect.value; const amount = parseFloat(withdrawalAmountInput.value); const address = walletAddressInput.value.trim(); if (isNaN(amount) || amount <= 0) return showFeedback(withdrawalFeedbackEl, "Please enter a valid amount.", "error"); if (address === '') return showFeedback(withdrawalFeedbackEl, "Please enter a wallet address.", "error"); let newBalance; const fee = amount * (WITHDRAWAL_FEE_PERCENT / 100); const amountAfterFee = amount - fee; if (currency === 'ton') { if (amount < MIN_TON_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum TON withdrawal is ${MIN_TON_WITHDRAWAL}.`, "error"); if (amount > user.ton_balance) return showFeedback(withdrawalFeedbackEl, `Insufficient TON balance.`, "error"); newBalance = { ton_balance: parseFloat(user.ton_balance) - amount }; } else if (currency === 'sol') { if (amount < MIN_SOL_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum SOL withdrawal is ${MIN_SOL_WITHDRAWAL}.`, "error"); if (amount > user.sol_balance) return showFeedback(withdrawalFeedbackEl, `Insufficient SOL balance.`, "error"); newBalance = { sol_balance: parseFloat(user.sol_balance) - amount }; } await updateUserProfile(newBalance); await supabase.from('transaction_logs').insert({ user_id: user.id, transaction_type: 'withdrawal', currency: currency.toUpperCase(), amount: amountAfterFee, withdrawal_address: address, status: 'pending' }); withdrawalAmountInput.value = ''; walletAddressInput.value = ''; showFeedback(withdrawalFeedbackEl, `Request for ${amount} ${currency.toUpperCase()} submitted. You will receive ~${amountAfterFee.toFixed(4)} after fees.`, "success"); fetchAndRenderWithdrawalHistory(); }
    async function handleHistoryToggle(event) { if (event.target.open) await fetchAndRenderWithdrawalHistory(); }
    async function fetchAndRenderWithdrawalHistory() { withdrawalHistoryContainer.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>'; const { data, error } = await supabase.from('transaction_logs').select('*').eq('user_id', user.id).eq('transaction_type', 'withdrawal').order('created_at', { ascending: false }); if (error) { withdrawalHistoryContainer.innerHTML = '<p class="placeholder-text error-text">Could not load history.</p>'; return; } if (data.length === 0) { withdrawalHistoryContainer.innerHTML = '<p class="placeholder-text">No withdrawal history yet.</p>'; return; } withdrawalHistoryContainer.innerHTML = data.map(tx => `<div class="history-item"><div class="history-details"><p>Amount: <strong>${tx.amount.toFixed(4)} ${tx.currency}</strong></p><p class="history-address">To: ${tx.withdrawal_address}</p></div><div class="history-status ${tx.status}">${tx.status}</div><div class="history-date">${new Date(tx.created_at).toLocaleString()}</div></div>`).join(''); }
    async function handleLeaderboardToggle(event) { if (event.target.open) await fetchAndRenderLeaderboard(); }
    async function fetchAndRenderLeaderboard() { leaderboardList.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>'; const { data, error } = await supabase.from('profiles').select('full_name, points').order('points', { ascending: false }).limit(100); if (error) { leaderboardList.innerHTML = '<p class="placeholder-text error-text">Could not load leaderboard.</p>'; return; } if (data.length === 0) { leaderboardList.innerHTML = '<p class="placeholder-text">Leaderboard is empty.</p>'; return; } leaderboardList.innerHTML = data.map((player, index) => `<div class="leaderboard-item" style="--delay: ${index * 50}ms"><span class="leaderboard-rank">#${index + 1}</span><span class="leaderboard-name">${player.full_name}</span><span class="leaderboard-points">${Math.floor(player.points).toLocaleString()}</span></div>`).join(''); }
    async function fetchAndRenderEventStats() { totalUsersValueEl.textContent = 'Loading...'; totalPointsValueEl.textContent = 'Loading...'; const { count, error: countError } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); if (countError) { totalUsersValueEl.textContent = 'Error'; } else { totalUsersValueEl.textContent = count.toLocaleString(); } const { data: totalPoints, error: rpcError } = await supabase.rpc('get_total_points'); if (rpcError) { totalPointsValueEl.textContent = 'Error'; } else { totalPointsValueEl.textContent = Math.floor(totalPoints).toLocaleString(); } }

    // --- START THE APP ---
    main().catch(error => { console.error("Failed to initialize the app:", error); loadingOverlay.innerHTML = `<p style="color: var(--error-color); text-align: center;">Failed to load game data.<br>Please try again later.<br><small>${error.message}</small></p>`; });
});
