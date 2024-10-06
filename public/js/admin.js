$(document).ready(function() {
    // Bets page functionality
    if ($('#filterButton').length) {
        $('#filterButton').click(function() {
            applyFilters();
        });

        $('#resetButton').click(function() {
            resetFilters();
        });
    }

    // Users page functionality
    if ($('.issue-points-btn').length) {
        $('.issue-points-btn').click(function() {
            const userId = $(this).data('user-id');
            const username = $(this).data('username');
            openIssuePointsModal(userId, username);
        });
    }

    function applyFilters() {
        const filters = {
            username: $('#usernameFilter').val(),
            gameName: $('#gameSelect').val(),
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val()
        };
        window.location.href = '/bets?' + $.param(filters);
    }

    function resetFilters() {
        $('#usernameFilter').val('');
        $('#gameSelect').val('');
        $('#startDate').val('');
        $('#endDate').val('');
        window.location.href = '/bets';
    }

    function openIssuePointsModal(userId, username) {
        // Implement the modal opening logic here
        console.log(`Opening modal for user ${username} (ID: ${userId})`);
        // You can use Bootstrap's modal or implement your own modal logic
    }
});