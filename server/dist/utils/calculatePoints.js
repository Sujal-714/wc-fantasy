"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePoints = void 0;
const calculatePoints = (stats, position) => {
    let points = 0;
    // Minutes played
    if (stats.minutes_played >= 60)
        points += 2;
    else if (stats.minutes_played > 0)
        points += 1;
    // Goals
    if (position === 'GK' || position === 'DEF')
        points += stats.goals * 6;
    else if (position === 'MID')
        points += stats.goals * 5;
    else
        points += stats.goals * 4;
    // Assists
    points += stats.assists * 3;
    // Clean sheet
    if (stats.clean_sheet) {
        if (position === 'GK')
            points += 6;
        else if (position === 'DEF')
            points += 4;
        else if (position === 'MID')
            points += 1;
    }
    // Saves — every 3 saves = 1 point, GK only
    if (position === 'GK') {
        points += Math.floor(stats.saves / 3);
    }
    // Negatives
    points -= stats.yellow_cards * 1;
    points -= stats.red_cards * 3;
    points -= stats.penalties_missed * 2;
    return points;
};
exports.calculatePoints = calculatePoints;
