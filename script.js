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
    const reels = document.querySelectorAll('.reel'); // The parent reel containers
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

    // =================================================================
    // --- SUPABASE & SDK INITIALIZATION ---
    // =================================================================
    const SUPABASE_URL = 'https://vddnlobgtnwwplburlja.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZG5sb2JndG53d3BsYnVybGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDEyMTcsImV4cCI6MjA3NTUxNzIxN30.2zYyICX5QyNDcLcGWia1F04yXPfNH6M09aczNlsLFSM';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const AdController = window.Adsgram ? window.Adsgram.init({ blockId: "int-14190" }) : { show: () => { console.log("AD STUB: Main ad show"); return Promise.resolve(); } };
    const TreasureAdController = window.Adsgram ? window.Adsgram.init({ blockId: "int-15943" }) : { show: () => { console.log("AD STUB: Treasure ad show"); return Promise.resolve(); } };
    const TicketAdController = window.Adsgram ? window.Adsgram.init({ blockId: "int-15944" }) : { show: () => { console.log("AD STUB: Ticket ad show"); return Promise.resolve(); } };

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
    const STREAK_REWARDS = [ { day: 1, points: 2000, pulls: 3 }, { day: 2, points: 4000, pulls: 5 }, { day: 3, points: 6000, pulls: 7 }, { day: 4, points: 8000, pulls: 9 }, { day: 5, points: 10000, pulls: 10 }, { day: 6, points: 10000, pulls: 11 }, { day: 7, points: 10000, pulls: 12 } ];
    const DAILY_TASK_KEYS = ['pull10', 'watch2', 'winPair', 'earn10k', 'winJackpot'];
    const TREASURE_COOLDOWN = 3 * 60 * 1000;
    const TREASURE_REWARD_POINTS = 2000;
    const TICKET_COOLDOWN = 5 * 60 * 1000;
    const TICKET_REWARD_PULLS = 6;

    // --- STATE MANAGEMENT ---
    let user = {}; 
    let tasks = {}; 
    let taskProgress = {};
    let isSpinning = false;
    let totalUserCount = 0;
    
    // =================================================================
    // --- DATA & INITIALIZATION LOGIC ---
    // =================================================================

    const main = async () => {
        setupEventListeners();
        
        const TWA = window.Telegram.WebApp;
        // Production-ready check: Ensure the app is running inside Telegram
        if (!TWA || !TWA.initDataUnsafe || !TWA.initDataUnsafe.user || !TWA.initDataUnsafe.user.id) {
            console.error("Telegram user data not found. This app must be run inside Telegram.");
            loadingOverlay.innerHTML = `<p style="color: var(--text-color); text-align: center;">This app can only be used inside Telegram.</p>`;
            loadingOverlay.style.opacity = '1'; // Ensure the error is visible
            return; // Halt execution
        }

        // If we're here, we have valid Telegram user data
        TWA.ready();
        TWA.expand();
        document.body.style.setProperty('--bg-color', TWA.themeParams.bg_color || '#0F0F1A');
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
            const { data: newUser, error: createError } = await supabase.from('profiles').insert({ telegram_id: telegramUser.id, username: telegramUser.username ? '@' + telegramUser.username : 'No Username', full_name: fullName || 'Gamer', points: 1250, pulls: 20 }).select().single();
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
    }

    function handleAnnouncement() { announcementModal.classList.remove('hidden'); }
    
    function navigateTo(pageId) { pages.forEach(page => page.classList.remove('active')); document.getElementById(pageId).classList.add('active'); navButtons.forEach(button => button.classList.toggle('active', button.dataset.page === pageId)); if (pageId === 'tasks-page') renderTasksPage(); if (pageId === 'wallet-page') { fetchAndRenderWithdrawalHistory(); checkWithdrawalGate(); } if (pageId === 'events-page') fetchAndRenderEventStats(); }
    
    function updateAllUI() { if (!user || !user.id) return; const oldPoints = parseInt(pointsValueTop.textContent.replace(/,/g, ''), 10); const newPoints = Math.floor(user.points); if (oldPoints !== newPoints) { pointsValueTop.classList.add('pulse'); setTimeout(() => pointsValueTop.classList.remove('pulse'), 600); } pointsValueTop.textContent = newPoints.toLocaleString(); profileNameEl.textContent = user.full_name; profileUsernameEl.textContent = user.username; profilePointsEl.textContent = Math.floor(user.points).toLocaleString(); pullsAmountEl.textContent = user.pulls; tonBalanceEl.textContent = parseFloat(user.ton_balance).toFixed(2); solBalanceEl.textContent = parseFloat(user.sol_balance).toFixed(4); }
    
    function updateButtonStates() { if (isSpinning || !user?.id) return; if (user.pulls > 0) { pullButton.disabled = false; watchAdButton.disabled = true; resultText.textContent = "PULL THE LEVER!"; } else { pullButton.disabled = true; watchAdButton.disabled = false; resultText.textContent = "WATCH AD TO PLAY"; } }
    
    async function checkDailyResets() { const today = getTodayDateString(); const lastClaimDateStr = user.last_streak_claim_date; if (lastClaimDateStr && lastClaimDateStr !== today) { const lastClaimDate = new Date(lastClaimDateStr); const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); if (lastClaimDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0]) { await updateUserProfile({ daily_streak: 0 }); } } }
    
    function getTodayDateString() { return new Date().toISOString().split('T')[0]; }
    
    function renderTasksPage() { renderDailyStreak(); renderDailyTasks(); }

    function renderDailyStreak() { streakContainer.innerHTML = ''; const today = getTodayDateString(); STREAK_REWARDS.forEach(reward => { const isClaimed = user.daily_streak >= reward.day; const isClaimable = user.daily_streak + 1 === reward.day && user.last_streak_claim_date !== today; const itemEl = document.createElement('div'); itemEl.className = 'streak-item'; if (isClaimable) itemEl.classList.add('active'); if (isClaimed) itemEl.classList.add('claimed'); let rewardString = ''; if (reward.points) rewardString += `<strong>+${reward.points.toLocaleString()}</strong> Points`; if (reward.points && reward.pulls) rewardString += ' & '; if (reward.pulls) rewardString += `<strong>+${reward.pulls}</strong> Pulls`; let buttonText = 'Locked'; let buttonClass = ''; if (isClaimable) { buttonText = 'Claim'; buttonClass = 'claimable'; } if (isClaimed) { buttonText = 'Claimed'; buttonClass = 'claimed'; } itemEl.innerHTML = `<div class="streak-info"><h3>Day ${reward.day}</h3><p>${rewardString}</p></div><button class="streak-claim-button ${buttonClass}" ${!isClaimable ? 'disabled' : ''}>${buttonText}</button>`; if (isClaimable) { itemEl.querySelector('button').onclick = () => claimStreakReward(reward.day); } streakContainer.appendChild(itemEl); }); }
    function renderDailyTasks() { tasksContainer.innerHTML = ''; if (Object.keys(tasks).length === 0) { tasksContainer.innerHTML = '<p class="placeholder-text">Loading tasks...</p>'; return; } DAILY_TASK_KEYS.forEach(taskKey => { const taskDef = Object.values(tasks).find(t => t.task_key === taskKey); if (!taskDef) return; const progress = taskProgress[taskKey]?.current_progress || 0; const isClaimed = taskProgress[taskKey]?.is_claimed || false; const isComplete = progress >= taskDef.target_value; let rewardText = taskDef.reward_type === 'points' ? `+${taskDef.reward_amount.toLocaleString()} PTS` : `+${taskDef.reward_amount} Pulls`; const taskEl = document.createElement('div'); taskEl.className = 'task-item'; taskEl.innerHTML = `<div class="task-info"><p>${taskDef.description} (${progress}/${taskDef.target_value})</p><div class="progress-bar"><div class="progress-bar-inner" style="width: ${Math.min(100, (progress / taskDef.target_value) * 100)}%;"></div></div></div><div class="task-reward">${rewardText}</div><button class="claim-button" data-task-key="${taskDef.task_key}" ${(!isComplete || isClaimed) ? 'disabled' : ''}>${isClaimed ? 'Claimed' : 'Claim'}</button>`; tasksContainer.appendChild(taskEl); }); tasksContainer.querySelectorAll('.claim-button').forEach(button => button.addEventListener('click', (e) => claimTaskReward(e.currentTarget.dataset.taskKey))); }
    function showFeedback(element, message, type) { element.textContent = message; element.className = `feedback-message ${type} show`; setTimeout(() => { element.classList.remove('show'); }, 4000); }
    
    // --- GAME ACTIONS ---
    function initializeTimedRewards() { setInterval(updateTimedRewards, 1000); updateTimedRewards(); }
    
    function updateTimedRewards() { const now = Date.now(); const lastTreasureClaim = user.last_treasure_claim ? new Date(user.last_treasure_claim).getTime() : 0; const treasureCooldownEnd = lastTreasureClaim + TREASURE_COOLDOWN; if (now < treasureCooldownEnd) { treasureTimerFloat.textContent = formatTime(treasureCooldownEnd - now); treasureBtnFloat.disabled = true; } else { treasureTimerFloat.textContent = ''; treasureBtnFloat.disabled = false; } const lastTicketClaim = user.last_ticket_claim ? new Date(user.last_ticket_claim).getTime() : 0; const ticketCooldownEnd = lastTicketClaim + TICKET_COOLDOWN; if (now < ticketCooldownEnd) { ticketTimerFloat.textContent = formatTime(ticketCooldownEnd - now); ticketBtnFloat.disabled = true; } else { ticketTimerFloat.textContent = ''; ticketBtnFloat.disabled = false; } }
    function formatTime(ms) { const totalSeconds = Math.ceil(ms / 1000); const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }
    
    async function handleClaimTreasure() { if (treasureBtnFloat.disabled) return; treasureBtnFloat.disabled = true; try { await TreasureAdController.show(); await updateUserProfile({ points: user.points + TREASURE_REWARD_POINTS, last_treasure_claim: new Date().toISOString() }); updateAllUI(); } catch (e) { console.error("Treasure ad failed.", e); } finally { updateTimedRewards(); } }
    async function handleClaimTickets() { if (ticketBtnFloat.disabled) return; ticketBtnFloat.disabled = true; try { await TicketAdController.show(); await updateUserProfile({ pulls: user.pulls + TICKET_REWARD_PULLS, last_ticket_claim: new Date().toISOString() }); updateAllUI(); updateButtonStates(); } catch (e) { console.error("Ticket ad failed.", e); } finally { updateTimedRewards(); } }
    async function claimStreakReward(day) { const today = getTodayDateString(); if (user.last_streak_claim_date === today || user.daily_streak + 1 !== day) return; const reward = STREAK_REWARDS.find(r => r.day === day); await updateUserProfile({ daily_streak: user.daily_streak + 1, last_streak_claim_date: today, points: user.points + (reward.points || 0), pulls: user.pulls + (reward.pulls || 0) }); updateAllUI(); updateButtonStates(); renderTasksPage(); }
    async function claimTaskReward(taskKey) { const progressData = taskProgress[taskKey]; if (!progressData || progressData.is_claimed) return; const taskDef = Object.values(tasks).find(t => t.task_key === taskKey); if (progressData.current_progress >= taskDef.target_value) { let profileUpdate = {}; if (taskDef.reward_type === 'points') profileUpdate.points = user.points + taskDef.reward_amount; else if (taskDef.reward_type === 'pulls') profileUpdate.pulls = user.pulls + taskDef.reward_amount; await updateUserProfile(profileUpdate); progressData.is_claimed = true; await supabase.from('user_task_progress').update({ is_claimed: true }).match({ user_id: user.id, task_id: taskDef.id, date: getTodayDateString() }); updateAllUI(); updateButtonStates(); renderTasksPage(); } }
    function handleWatchAd() { watchAdButton.disabled = true; watchAdButton.textContent = "LOADING AD..."; AdController.show().then(async () => { await updateUserProfile({ pulls: user.pulls + 10 }); await updateTaskProgress('watch2'); updateAllUI(); updateButtonStates(); resultText.textContent = "YOU GOT 10 PULLS!"; }).catch(() => { resultText.textContent = "AD FAILED. NO REWARD."; }).finally(() => { watchAdButton.disabled = false; watchAdButton.textContent = "WATCH AD FOR 10 PULLS"; updateButtonStates(); renderTasksPage(); }); }
    
    // =================================================================
    // === ENTIRELY NEW, ROBUST & SIMPLIFIED ANIMATION LOGIC ===
    // =================================================================

    function getRandomIcon() {
        return GACHA_ITEMS[Math.floor(Math.random() * GACHA_ITEMS.length)];
    }

    async function handlePull() {
        if (user.pulls <= 0 || isSpinning) return;
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
            const promise = new Promise(resolve => {
                // Prepare the reel with 3 icons: above, middle (blur), below (final result)
                reelInner.innerHTML = `
                    <div class="reel-icon" style="top: -100%">${getRandomIcon().symbol}</div>
                    <div class="reel-icon" style="top: 0%">${getRandomIcon().symbol}</div>
                    <div class="reel-icon" style="top: 100%">${results[i].symbol}</div>
                `;
                
                setTimeout(() => {
                    reel.classList.add('spinning');
                    
                    setTimeout(() => {
                        reel.classList.remove('spinning');
                        // Show the final result icon with a bounce
                        reelInner.innerHTML = `<div class="reel-icon bounce">${results[i].symbol}</div>`;
                        resolve();
                    }, 1500 + i * 500); // Staggered stop time
                }, i * 200); // Staggered start time
            });
            spinPromises.push(promise);
        });

        // Wait for all animations to complete
        await Promise.all(spinPromises);

        // All reels have stopped, now reliably check for wins
        checkWin(results);
    }

    async function checkWin(results) {
        const symbols = results.map(r => r.symbol);
        let pointsWon = 0;
        let resultString = '';
        let isJackpot = false;
        let isPair = false;

        // Apply win styling to the bounced icons
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

        // This part is now guaranteed to run after the animation is complete
        await updateUserProfile({ points: user.points + pointsWon });
        await updateTaskProgress('earn10k', pointsWon);
        if (isJackpot) await updateTaskProgress('winJackpot');
        if (isPair) await updateTaskProgress('winPair');
        
        // After a delay to admire the result, close the shutter and reset
        setTimeout(() => {
            shutter.classList.remove('open');
            // Reset the reels visually for the next spin's shutter reveal
            reelInners.forEach(reelInner => {
                reelInner.innerHTML = `🎰`;
            });
            isSpinning = false;
            updateAllUI(); // This will also update the points display with the new total
            updateButtonStates();
            renderTasksPage();
        }, 2000);
    }


    // --- WALLET/PROFILE/EVENTS FUNCTIONS (Unchanged) ---
    async function checkWithdrawalGate() { const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); if (error) { console.error("Could not fetch user count:", error); return; } totalUserCount = count; const progressPercent = Math.min(100, (totalUserCount / WITHDRAWAL_USER_GATE) * 100); userCountProgress.textContent = `${totalUserCount.toLocaleString()} / ${WITHDRAWAL_USER_GATE.toLocaleString()} Players`; userProgressBarInner.style.width = `${progressPercent}%`; if (totalUserCount >= WITHDRAWAL_USER_GATE) { withdrawalGateNotice.classList.add('hidden'); withdrawalFieldset.disabled = false; } else { withdrawalGateNotice.classList.remove('hidden'); withdrawalFieldset.disabled = true; } }
    async function handleExchange() { const pointsToExchange = parseInt(pointsToExchangeInput.value, 10); const selectedCrypto = exchangeCryptoSelect.value; if (isNaN(pointsToExchange) || pointsToExchange <= 0) return showFeedback(exchangeFeedbackEl, "Please enter a valid number.", "error"); if (pointsToExchange > user.points) return showFeedback(exchangeFeedbackEl, "You do not have enough points.", "error"); if (pointsToExchange % POINTS_PER_BLOCK !== 0) return showFeedback(exchangeFeedbackEl, `Exchange in blocks of ${POINTS_PER_BLOCK.toLocaleString()}.`, "error"); const blocks = pointsToExchange / POINTS_PER_BLOCK; let profileUpdate = { points: user.points - pointsToExchange }; let feedbackMessage = ''; if (selectedCrypto === 'ton') { const tonGained = blocks * TON_PER_BLOCK; profileUpdate.ton_balance = parseFloat(user.ton_balance) + tonGained; feedbackMessage = `Exchanged for ${tonGained.toFixed(2)} TON!`; } else if (selectedCrypto === 'sol') { const solGained = blocks * SOL_PER_BLOCK; profileUpdate.sol_balance = parseFloat(user.sol_balance) + solGained; feedbackMessage = `Exchanged for ${solGained.toFixed(4)} SOL!`; } await updateUserProfile(profileUpdate); await supabase.from('transaction_logs').insert({ user_id: user.id, transaction_type: 'exchange', points_exchanged: pointsToExchange, currency: selectedCrypto.toUpperCase(), status: 'completed' }); updateAllUI(); pointsToExchangeInput.value = ''; showFeedback(exchangeFeedbackEl, feedbackMessage, "success"); }
    async function handleWithdraw() { const currency = cryptoSelect.value; const amount = parseFloat(withdrawalAmountInput.value); const address = walletAddressInput.value.trim(); if (isNaN(amount) || amount <= 0) return showFeedback(withdrawalFeedbackEl, "Please enter a valid amount.", "error"); if (address === '') return showFeedback(withdrawalFeedbackEl, "Please enter a wallet address.", "error"); let newBalance; const fee = amount * (WITHDRAWAL_FEE_PERCENT / 100); const amountAfterFee = amount - fee; if (currency === 'ton') { if (amount < MIN_TON_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum TON withdrawal is ${MIN_TON_WITHDRAWAL}.`, "error"); if (amount > user.ton_balance) return showFeedback(withdrawalFeedbackEl, `Insufficient TON balance.`, "error"); newBalance = { ton_balance: parseFloat(user.ton_balance) - amount }; } else if (currency === 'sol') { if (amount < MIN_SOL_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum SOL withdrawal is ${MIN_SOL_WITHDRAWAL}.`, "error"); if (amount > user.sol_balance) return showFeedback(withdrawalFeedbackEl, `Insufficient SOL balance.`, "error"); newBalance = { sol_balance: parseFloat(user.sol_balance) - amount }; } await updateUserProfile(newBalance); await supabase.from('transaction_logs').insert({ user_id: user.id, transaction_type: 'withdrawal', currency: currency.toUpperCase(), amount: amountAfterFee, withdrawal_address: address, status: 'pending' }); updateAllUI(); withdrawalAmountInput.value = ''; walletAddressInput.value = ''; showFeedback(withdrawalFeedbackEl, `Request for ${amount} ${currency.toUpperCase()} submitted. You will receive ~${amountAfterFee.toFixed(4)} after fees.`, "success"); fetchAndRenderWithdrawalHistory(); }
    async function handleHistoryToggle(event) { if (event.target.open) await fetchAndRenderWithdrawalHistory(); }
    async function fetchAndRenderWithdrawalHistory() { withdrawalHistoryContainer.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>'; const { data, error } = await supabase.from('transaction_logs').select('*').eq('user_id', user.id).eq('transaction_type', 'withdrawal').order('created_at', { ascending: false }); if (error) { withdrawalHistoryContainer.innerHTML = '<p class="placeholder-text error-text">Could not load history.</p>'; return; } if (data.length === 0) { withdrawalHistoryContainer.innerHTML = '<p class="placeholder-text">No withdrawal history yet.</p>'; return; } withdrawalHistoryContainer.innerHTML = data.map(tx => `<div class="history-item"><div class="history-details"><p>Amount: <strong>${tx.amount.toFixed(4)} ${tx.currency}</strong></p><p class="history-address">To: ${tx.withdrawal_address}</p></div><div class="history-status ${tx.status}">${tx.status}</div><div class="history-date">${new Date(tx.created_at).toLocaleString()}</div></div>`).join(''); }
    async function handleLeaderboardToggle(event) { if (event.target.open) await fetchAndRenderLeaderboard(); }
    async function fetchAndRenderLeaderboard() { leaderboardList.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>'; const { data, error } = await supabase.from('profiles').select('full_name, points').order('points', { ascending: false }).limit(100); if (error) { leaderboardList.innerHTML = '<p class="placeholder-text error-text">Could not load leaderboard.</p>'; return; } if (data.length === 0) { leaderboardList.innerHTML = '<p class="placeholder-text">Leaderboard is empty.</p>'; return; } leaderboardList.innerHTML = data.map((player, index) => `<div class="leaderboard-item"><span class="leaderboard-rank">#${index + 1}</span><span class="leaderboard-name">${player.full_name}</span><span class="leaderboard-points">${Math.floor(player.points).toLocaleString()}</span></div>`).join(''); }
    async function fetchAndRenderEventStats() { totalUsersValueEl.textContent = 'Loading...'; totalPointsValueEl.textContent = 'Loading...'; const { count, error: countError } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); if (countError) { totalUsersValueEl.textContent = 'Error'; } else { totalUsersValueEl.textContent = count.toLocaleString(); } const { data: totalPoints, error: rpcError } = await supabase.rpc('get_total_points'); if (rpcError) { totalPointsValueEl.textContent = 'Error'; } else { totalPointsValueEl.textContent = Math.floor(totalPoints).toLocaleString(); } }

    // --- START THE APP ---
    main().catch(error => { console.error("Failed to initialize the app:", error); loadingOverlay.innerHTML = `<p style="color: var(--error-color); text-align: center;">Failed to load game data.<br>Please try again later.<br><small>${error.message}</small></p>`; });
});
