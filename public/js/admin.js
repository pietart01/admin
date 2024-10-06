$(document).ready(function() {

    $('table td').each(function() {
        let content = $(this).text().trim();
        if (content && !isNaN(new Date(content).getTime())) {
            let formattedDate = formatDate(new Date(content));
            if (formattedDate !== 'Invalid Date') {
                $(this).text(formattedDate);
            }
        }
    });

    // Bets page functionality
    if ($('#filterButton').length && $('#gameSelect').length) {
        $('#filterButton').click(function() {
            applyFilters('bets');
        });

        $('#resetButton').click(function() {
            resetFilters('bets');
        });
    }

    // Users page functionality
    if ($('#filterButton').length && !$('#gameSelect').length) {
        $('#filterButton').click(function() {
            applyFilters('users');
        });

        $('#resetButton').click(function() {
            resetFilters('users');
        });
    }

    $('.issue-points-btn').click(function() {
        const userId = $(this).data('user-id');
        const username = $(this).data('username');
        openIssuePointsModal(userId, username);
    });

    function applyFilters(page) {
        const filters = {
            username: $('#usernameFilter').val(),
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val()
        };

        if (page === 'bets') {
            filters.gameName = $('#gameSelect').val();
        }

        window.location.href = `/${page}?` + $.param(filters);
    }

    function resetFilters(page) {
        $('#usernameFilter').val('');
        $('#startDate').val('');
        $('#endDate').val('');

        if (page === 'bets') {
            $('#gameSelect').val('');
        }

        window.location.href = `/${page}`;
    }

    function openIssuePointsModal(userId, username) {
        $('#issuePointsModalLabel').text(`Issue Points to ${username}`);
        $('#userId').val(userId);
        $('#points').val('');
        $('#issuePointsModal').modal('show');
    }

    $('#issuePointsSubmit').click(function() {
        const userId = $('#userId').val();
        const points = $('#points').val();

        if (!points || isNaN(points) || points <= 0) {
            alert('Please enter a valid number of points.');
            return;
        }

        $.ajax({
            url: `/api/users/${userId}/issue`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ points: parseInt(points, 10) }),
            success: function(response) {
                alert(response.message);
                $('#issuePointsModal').modal('hide');
                // Refresh the user list to show updated balance
                location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error issuing points:', errorThrown);
                alert('Failed to issue points. Please try again.');
            }
        });
    });
});