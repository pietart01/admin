create table board
(
    id        int auto_increment
        primary key,
    title     varchar(255)                        not null,
    content   text                                null,
    createdAt timestamp default CURRENT_TIMESTAMP null
);

create table gameCategory
(
    id           int auto_increment,
    categoryName varchar(15) null,
    constraint gameCategory_id_uindex
        unique (id)
);

alter table gameCategory
    add primary key (id);

create table gameInfo
(
    id                              bigint auto_increment
        primary key,
    gameCode                        varchar(7)                           not null,
    gameName                        varchar(255)                         not null,
    gameAlias                       varchar(15)                          null,
    gameCategoryId                  int                                  null,
    rtpRate                         decimal(6, 4)                        null,
    rollingRate                     decimal(6, 4)                        null,
    rollingCommissionRate           decimal(6, 4)                        null,
    isServiceable                   tinyint(1) default 0                 not null,
    isActive                        tinyint(1) default 0                 not null,
    createdAt                       datetime   default CURRENT_TIMESTAMP not null,
    backendUrl                      varchar(255)                         null,
    frontendUrl                     varchar(255)                         null,
    thumbnailUrl                    varchar(255)                         null,
    gameParameters                  json                                 not null,
    rollingCommissionExceptionCount int        default 0                 not null,
    maxPayout                       bigint     default 20000000000       not null,
    maxRtp                          bigint                               null,
    constraint uq_gameCode
        unique (gameCode)
);

create index idxSlotGameCreatedAt
    on gameInfo (createdAt);

create index idxSlotGameGameCode
    on gameInfo (gameCode);

create index idxSlotGameIsActive
    on gameInfo (isActive);

create table pokerAction
(
    id                int auto_increment
        primary key,
    pokerHandId       int                                            null,
    pokerHandPlayerId int                                            null,
    actionType        enum ('fold', 'check', 'call', 'bet', 'raise') null,
    amount            decimal(10, 2)                                 null,
    actionTime        datetime                                       null
);

create table pokerBuyIn
(
    id                  int auto_increment
        primary key,
    pokerTableSessionId int            null,
    amount              decimal(10, 2) null,
    buyInTime           datetime       null
);

create table pokerBuyOut
(
    id                  int auto_increment
        primary key,
    pokerTableSessionId int            null,
    amount              decimal(10, 2) null,
    buyOutTime          datetime       null
);

create table pokerChannel
(
    id          int auto_increment
        primary key,
    channelName varchar(50) null,
    description text        null,
    constraint channelName
        unique (channelName)
);

create table pokerHand
(
    id          int auto_increment
        primary key,
    pokerRoomId int            null,
    startTime   datetime       null,
    endTime     datetime       null,
    pot         decimal(10, 2) null,
    flop1       varchar(2)     null,
    flop2       varchar(2)     null,
    flop3       varchar(2)     null,
    turn        varchar(2)     null,
    river       varchar(2)     null,
    winnerId    int            null,
    winningHand varchar(50)    null
);

create table pokerHandPlayer
(
    id                  int auto_increment
        primary key,
    pokerHandId         int            null,
    pokerTableSessionId int            null,
    startingStack       decimal(10, 2) null,
    endingStack         decimal(10, 2) null,
    card1               varchar(2)     null,
    card2               varchar(2)     null
);

create table pokerRoom
(
    id             int auto_increment
        primary key,
    pokerChannelId int                                         null,
    roomName       varchar(50)                                 null,
    description    text                                        null,
    gameType       enum ('texasHoldem')                        null,
    startTime      datetime                                    null,
    endTime        datetime                                    null,
    maxPlayers     int                                         null,
    minBuyIn       decimal(10, 2)                              null,
    maxBuyIn       decimal(10, 2)                              null,
    status         enum ('waiting', 'inProgress', 'completed') null
);

create table pokerTableSession
(
    id           int auto_increment
        primary key,
    pokerRoomId  int                         null,
    userId       int                         null,
    seatNumber   int                         null,
    buyInAmount  decimal(10, 2)              null,
    currentStack decimal(10, 2)              null,
    startTime    datetime                    null,
    endTime      datetime                    null,
    status       enum ('active', 'inactive') null
);

create table rebateConfiguration
(
    id                    int auto_increment
        primary key,
    maxTotalRollingRebate decimal(5, 2) not null,
    maxTotalLosingRebate  decimal(5, 2) not null,
    gameCategoryId        int           null,
    constraint gameInfoId
        unique (gameCategoryId)
);

create table session
(
    id        int auto_increment
        primary key,
    sessionId varchar(63)                        null,
    userId    int                                not null,
    kind      varchar(15)                        null,
    createdAt datetime default CURRENT_TIMESTAMP null,
    status    varchar(15)                        null,
    ipAddress varchar(63)                        null,
    userAgent varchar(127)                       null,
    data      json                               null
);

create table slotSpin
(
    id                    bigint                             not null
        primary key,
    gameInfoId            bigint                             not null,
    userId                bigint                             not null,
    betAmount             bigint                             not null,
    payout                bigint                             null,
    balanceAfterSpin      bigint                             null,
    createdAt             datetime default CURRENT_TIMESTAMP not null,
    rollingCommissionRate decimal(6, 4)                      null,
    eligibleForRolling    tinyint  default 1                 not null,
    spinSeq               int                                null,
    rollingRate           decimal(6, 4)                      null,
    bonusId               bigint                             null,
    spinData              json                               null
);

create index idx_createdAt
    on slotSpin (createdAt);

create index idx_slotId
    on slotSpin (gameInfoId);

create index idx_userId
    on slotSpin (userId);

create table user
(
    id                int auto_increment
        primary key,
    username          varchar(50)                           not null,
    email             varchar(100)                          null,
    passwordHash      varchar(255)                          not null,
    registrationDate  datetime    default CURRENT_TIMESTAMP null,
    lastLoginDate     datetime                              null,
    isActive          tinyint(1)  default 1                 null,
    displayName       varchar(30) default '-'               null,
    balance           bigint      default 0                 not null,
    parentUserId      int                                   null,
    level             int                                   null,
    pinCode           varchar(10)                           null,
    accountHolder     varchar(20)                           null,
    bankName          varchar(20)                           null,
    accountNumber     varchar(50)                           null,
    lastIpAddress     varchar(45)                           null,
    lastLogin         datetime                              null,
    isGameRestriction tinyint(1)  default 0                 null,
    isLocked          tinyint(1)  default 0                 null,
    chip              bigint      default 0                 null,
    constraint username
        unique (username)
);

create index username_2
    on user (username);

create table userRebateSetting
(
    id                      int auto_increment
        primary key,
    userId                  int                        not null,
    childUserId             int                        not null,
    rollingRebatePercentage decimal(5, 2) default 0.00 null,
    losingRebatePercentage  decimal(5, 2) default 0.00 null,
    gameCategoryId          int                        not null,
    constraint userId
        unique (userId, childUserId, gameCategoryId)
);

create table userStorage
(
    id             int auto_increment
        primary key,
    userId         int                                      not null,
    silverCapacity decimal(18, 2) default 0.00              null,
    goldCapacity   decimal(18, 2) default 0.00              null,
    silverStored   decimal(18, 2) default 0.00              null,
    goldStored     decimal(18, 2) default 0.00              null,
    lastUpdated    datetime       default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint userId
        unique (userId)
);

create table userTransaction
(
    id              int auto_increment
        primary key,
    userId          int                                                          not null,
    transactionType enum ('DEPOSIT', 'WITHDRAW', 'TRANSFER', 'PURCHASE', 'SALE') not null,
    currencyType    enum ('COIN', 'SILVER', 'GOLD')                              not null,
    amount          decimal(18, 2)                                               not null,
    recipientUserId int                                                          null,
    description     varchar(255)                                                 null,
    transactionDate datetime default CURRENT_TIMESTAMP                           null
);

create index recipientUserId
    on userTransaction (recipientUserId);

create index userId
    on userTransaction (userId);

create table userVirtualCurrency
(
    id           int auto_increment
        primary key,
    userId       int                                      not null,
    coinAmount   decimal(18, 2) default 0.00              null,
    silverAmount decimal(18, 2) default 0.00              null,
    goldAmount   decimal(18, 2) default 0.00              null,
    lastUpdated  datetime       default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint userId
        unique (userId)
);

