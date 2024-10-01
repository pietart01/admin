$(document).ready(function() {
    let allUsers = [];

    function fetchAndRenderUsers() {
        $.get('/users', function(users) {
            allUsers = users;
            renderUserList(users);
            $('#contentTitle').text('User List');
        });
    }

    function renderUserList(users) {
        let html = `
      <div class="mb-3">
        <input type="text" id="usernameSearch" class="form-control mb-2" placeholder="Search by username">
        <div class="row">
          <div class="col-md-6 mb-2">
            <label for="startDate">Start Date:</label>
            <input type="date" id="startDate" class="form-control">
          </div>
          <div class="col-md-6 mb-2">
            <label for="endDate">End Date:</label>
            <input type="date" id="endDate" class="form-control">
          </div>
        </div>
        <button id="searchButton" class="btn btn-primary">Search</button>
        <button id="resetButton" class="btn btn-secondary ml-2">Reset</button>
      </div>
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
        <td>$${user.balance.toFixed(2)}</td>
        <td>${moment(user.registrationDate).format('MMMM D, YYYY')}</td>
      </tr>`;
        });
        html += '</tbody></table></div>';
        $('#content').html(html);

        // Add event listeners for search functionality
        $('#searchButton').click(performSearch);
        $('#resetButton').click(resetSearch);
    }

    function performSearch() {
        const usernameQuery = $('#usernameSearch').val().toLowerCase();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        const filteredUsers = allUsers.filter(user => {
            const usernameMatch = user.username.toLowerCase().includes(usernameQuery);
            const registrationDate = moment(user.registrationDate);
            const dateMatch = (!startDate || registrationDate.isSameOrAfter(startDate)) &&
                (!endDate || registrationDate.isSameOrBefore(endDate));
            return usernameMatch && dateMatch;
        });

        renderUserList(filteredUsers);
    }

    function resetSearch() {
        $('#usernameSearch').val('');
        $('#startDate').val('');
        $('#endDate').val('');
        renderUserList(allUsers);
    }

    function fetchAndRenderBets() {
        $.get('/bets', function(bets) {
            let html = '<div class="table-responsive"><table class="table table-bordered table-striped">';
            html += '<thead><tr><th>Username</th><th>Game</th><th>Payout</th><th>Bet Amount</th><th>Rolling Rate</th><th>Balance After Spin</th></tr></thead><tbody>';
            bets.forEach(bet => {
                html += `<tr>
          <td>${bet.username}</td>
          <td>${bet.game}</td>
          <td>$${bet.payout.toFixed(2)}</td>
          <td>$${bet.betAmount.toFixed(2)}</td>
          <td>${(bet.rollingRate * 100).toFixed(2)}%</td>
          <td>$${bet.balanceAfterSpin.toFixed(2)}</td>
        </tr>`;
            });
            html += '</tbody></table></div>';
            $('#content').html(html);
            $('#contentTitle').text('Bet List');
        });
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

    // Logout functionality
    $('#logoutLink').click(function(e) {
        e.preventDefault();
        alert('Logout successful!');
    });

    // Load users by default
    fetchAndRenderUsers();
});