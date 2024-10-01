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
                        <th>Actions</th>
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
                <td>
                    <button class="btn btn-sm btn-primary issue-points-btn" data-user-id="${user.id}" data-username="${user.username}">
                        Issue Points
                    </button>
                </td>
            </tr>`;
        });
        html += '</tbody></table></div>';
        $('#content').html(html);

        // Attach event listener to the new buttons
        $('.issue-points-btn').click(function() {
            const userId = $(this).data('user-id');
            const username = $(this).data('username');
            openIssuePointsModal(userId, username);
        });
    }

    // Function to open the Issue Points modal
    function openIssuePointsModal(userId, username) {
        const modalHtml = `
        <div class="modal fade" id="issuePointsModal" tabindex="-1" aria-labelledby="issuePointsModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <form id="issuePointsForm">
                <div class="modal-header">
                  <h5 class="modal-title" id="issuePointsModalLabel">Issue Points to ${username}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label for="pointsInput">Points to Issue</label>
                    <input type="number" class="form-control" id="pointsInput" name="points" min="1" required>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-primary">Issue Points</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        `;

        // Append modal to the body
        $('body').append(modalHtml);

        // Show the modal using Bootstrap's modal method
        $('#issuePointsModal').modal('show');

        // Handle form submission
        $('#issuePointsForm').submit(function(e) {
            e.preventDefault();
            const points = parseInt($('#pointsInput').val(), 10);

            if (isNaN(points) || points <= 0) {
                alert('Please enter a valid number of points.');
                return;
            }

            // Send POST request to issue points
            $.ajax({
                url: `/users/${userId}/issue`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ points }),
                success: function(response) {
                    alert(response.message);
                    $('#issuePointsModal').modal('hide');
                    // Refresh the user list to show updated balance
                    fetchAndRenderUsers();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Error issuing points:', errorThrown);
                    alert('Failed to issue points. Please try again.');
                }
            });
        });

        // Remove the modal from DOM after it's hidden to prevent duplicates
        $('#issuePointsModal').on('hidden.bs.modal', function () {
            $('#issuePointsModal').remove();
        });
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

    // Initially load the Bets section
    fetchAndRenderBets();
});
