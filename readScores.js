const getMatchesArray = scoresText => scoresText
  .split('\n')
  .map(match => match
    .split(',')
    .map(teamScore => {
      const score = Number(
        teamScore.substring(
          teamScore.lastIndexOf(' ') + 1
        )
      );
      const team = teamScore.replace(score, '').trim();
      return { team, score };
    })
  )
  .filter(match => match.length === 2)
  .map(match => match
    .reduce(
      (a, v) => {
        if (match.indexOf(v) === 0) {
          a.away = v;
        } else {
          a.home = v;
        }
        return a;
      },
      {},
    )
  )
;

const splitMatchDays = matchesArray => {
  const matchDays = {};
  let playedToday = [];
  let currentDay = 1;
  matchesArray.forEach(match => {
    Object.keys(match).forEach(side => {
      const { team } = match[side];
      if (playedToday.includes(team)) {
        currentDay++;
        playedToday = [];
      } else {
        playedToday.push(team);
      }
    });
    const key = `Matchday ${currentDay}`;
    if(!matchDays[key]) {
      matchDays[key] = [];
    }
    matchDays[key].push(match);
  });
  return matchDays;
};

const calculateDayStandings = matchDays => {
  const standings = {};
  const dayStandings = {};
  Object.keys(matchDays).forEach((key) => {
    dayStandings[key] = {};
    matchDays[key].forEach(match => {
      const { home, away } = match;
      let result = 'draw';
      if (away.score !== home.score) {
        result = away.score > home.score ? 'away' : 'home';
      }
      Object.keys(match).forEach(side => {
        const { team } = match[side];
        if (!standings[team]) {
          standings[team] = 0;
        }
      });
      switch (result) {
        case 'home':
          standings[home.team] = standings[home.team] + 3;
        break;
        case 'away':
          standings[away.team] = standings[away.team] + 3;
        break;
        case 'draw':
        default:
          standings[home.team]++;
          standings[away.team]++;
      }
      Object.keys(match).forEach(side => {
        const { team } = match[side];
        dayStandings[key][team] = standings[team];
      });
    });
  });
  return dayStandings;
};

const formatDayStandingsText = dayStandings => {
  const days = Object.keys(dayStandings);
  let output = '';
  days.forEach((day, dayIndex) => {
    const standings = dayStandings[day];
    output += `${day}\n`;
    Object.keys(standings)
    .sort((a, b) => {
      const diff = standings[b] - standings[a];
      if (diff === 0) {
        return a > b ? 1 : -1;
      }
      return diff;
    })
    .forEach((team, i) => {
      const points = standings[team];
      if (i < 3) {
        output += `${team}, ${points} ${points > 1 ? 'pts' : 'pt'}\n`;
      }
    });
    if (dayIndex + 1 !== days.length) {
      output += `\n`;
    }
  });
  return output;
};

const readScores = scoresText => {
  const matchesArray = getMatchesArray(scoresText);
  const matchDays = splitMatchDays(matchesArray);
  const dayStandings = calculateDayStandings(matchDays);
  const outputText = formatDayStandingsText(dayStandings);
  return outputText;
};

module.exports = readScores;
