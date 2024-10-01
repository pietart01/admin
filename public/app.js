$(document).ready(function() {
    let allUsers = [];
    let allGames = [];

    function fetchAndRenderUsers() {
        $.get('/users')
          .done(function(users) {
              allUsers = users;
              renderUserList(users);
              $('#contentTitle').text('User List');
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
              console.error('Error fetching users:', errorThrown);
              $('#content').html('<div class="alert alert-danger">Error fetching users. Please try again later.</div>');
          });
    }

    function renderUserList(users) {
        let html = `
        <div class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Balance</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody>
        `;
        users.forEach(user => {
            html += `<tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>$${(user.balance / 100).toFixed(2)}</td>
                <td>${new Date(user.registrationDate).toLocaleString()}</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
        $('#content').html(html);
    }

    function fetchGames() {
        $.get('/games')
          .done(function(games) {
              allGames = games;
              let options = '<option value="">All Games</option>';
              games.forEach(game => {
                  options += `<option value="${game.gameName}">${game.gameName}</option>`;
              });
              $('#gameSelect').html(options);
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
              console.error('Error fetching games:', errorThrown);
          });
    }

    function fetchAndRenderBets(filters = {}) {
        const queryString = $.param(filters);
        $.get(`/bets?${queryString}`)
          .done(function(bets) {
              renderBetList(bets);
              $('#contentTitle').text('Bet List');
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
              console.error('Error fetching bets:', errorThrown);
              $('#content').html('<div class="alert alert-danger">Error fetching bets. Please try again later.</div>');
          });
    }

    function renderBetList(bets) {
        let html = `
        <div class="mb-3">
            <input type="text" id="usernameFilter" class="form-control mb-2" placeholder="Filter by username">
            <select id="gameSelect" class="form-control mb-2"></select>
            <div class="row">
                <div class="col-md-6 mb-2">
                    <input type="date" id="startDate" class="form-control" placeholder="Start Date">
                </div>
                <div class="col-md-6 mb-2">
                    <input type="date" id="endDate" class="form-control" placeholder="End Date">
                </div>
            </div>
            <button id="filterButton" class="btn btn-primary">Filter</button>
            <button id="resetButton" class="btn btn-secondary ml-2">Reset</button>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Game</th>
                        <th>Game Code</th>
                        <th>Game Type</th>
                        <th>RTP Rate</th>
                        <th>Payout</th>
                        <th>Bet Amount</th>
                        <th>Rolling Rate</th>
                        <th>Balance After Spin</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
        `;
        bets.forEach(bet => {
            html += `<tr>
                <td>${bet.username}</td>
                <td>${bet.game}</td>
                <td>${bet.gameCode}</td>
                <td>${bet.gameType}</td>
                <td>${(bet.rtpRate * 100).toFixed(2)}%</td>
                <td>$${(bet.payout / 100).toFixed(2)}</td>
                <td>$${(bet.betAmount / 100).toFixed(2)}</td>
                <td>${(bet.rollingRate * 100).toFixed(2)}%</td>
                <td>$${(bet.balanceAfterSpin / 100).toFixed(2)}</td>
                <td>${new Date(bet.createdAt).toLocaleString()}</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
        $('#content').html(html);

        $('#filterButton').click(applyFilters);
        $('#resetButton').click(resetFilters);
        fetchGames();
    }

    function applyFilters() {
        const filters = {
            username: $('#usernameFilter').val(),
            gameName: $('#gameSelect').val(),
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val()
        };
        fetchAndRenderBets(filters);
    }

    function resetFilters() {
        $('#usernameFilter').val('');
        $('#gameSelect').val('');
        $('#startDate').val('');
        $('#endDate').val('');
        fetchAndRenderBets();
    }

    $('#userLink').click(function(e) {
        e.preventDefault();
        fetchAndRenderUsers();
        if (window.innerWidth <= 767.98) {
            $('body').removeClass('sidebar-open').addClass('sidebar-closed sidebar-collapse');
        }
    });

    $('#betLink').click(function(e) {
        e.preventDefault();
        fetchAndRenderBets();
        if (window.innerWidth <= 767.98) {
            $('body').removeClass('sidebar-open').addClass('sidebar-closed sidebar-collapse');
        }
    });

    $('#logoutLink').click(function(e) {
        e.preventDefault();
        alert('Logout successful!');
    });

    fetchAndRenderBets();
});
