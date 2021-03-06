
'use strict';
const dataService = require('../../../lib/DataService.js').rebbl
, express = require('express')
, util = require('../../../lib/util.js');

class DivisionApi{
  constructor(){
    this.router = express.Router({mergeParams: true})
  }
  routesConfig(){
    
    this.router.get("/:league/:season",util.cache(600), async function(req,res){
      try {

        let {league, season} = req.params;

        let data = await dataService.getSeason({league:league, season:season});
        res.json(data.divisions);
      }
      catch (ex){
        console.error(ex);
        res.status(500).send('Something something error');
      }
    });

    this.router.get('/:league/:season/:division', util.cache(600), async function(req, res){
      try {
        let {league,season, division} = req.params;

        let data = await dataService.getSchedules({league:league,season:season,competition:division});
        res.json(data);
      }
      catch (ex){
        console.error(ex);
        res.status(500).send('Something something error');
      }
    });  

    this.router.get('/:league/:season/:division/slim', util.cache(600), async function(req, res){
      try {
        let {league,season, division} = req.params;

        let data = await dataService.getSchedules({league:league,season:season,competition:division});

        let ret = data.map(m => {
          let match_uuid = m.match_uuid;
          let homeCoachId = m.opponents[0].coach.id;
          let homeCoachName = m.opponents[0].coach.name;
          let homeTeamId = m.opponents[0].team.id;
          let homeTeamName = m.opponents[0].team.name;
          let homeTeamRace = m.opponents[0].team.race;
          let homeScore = m.opponents[0].team.score;
          let awayCoachId = m.opponents[1].coach.id;
          let awayCoachName = m.opponents[1].coach.name;
          let awayTeamId = m.opponents[1].team.id;
          let awayTeamName = m.opponents[1].team.name;
          let awayTeamRace = m.opponents[1].team.race;
          let awayScore = m.opponents[1].team.score;
          let round = m.round;

          return {round, match_uuid, 
            homeCoachId, homeCoachName, homeTeamId, homeTeamName, homeTeamRace, homeScore, 
            awayCoachId, awayCoachName, awayTeamId, awayTeamName, awayTeamRace, awayScore };
        })

        res.json(ret.sort((a,b)=> a.round > b.round ? 1 : -1));
      }
      catch (ex){
        console.error(ex);
        res.status(500).send('Something something error');
      }
    }); 


    this.router.get('/:league/:season/:division/:round', util.cache(600), async function(req, res){
      try {
        let {league,season, division, round} = req.params;

        let data = await dataService.getSchedules({league:league,season:season,competition:division, round:Number(round)});
        res.json(data);
      }
      catch (ex){
        console.error(ex);
        res.status(500).send('Something something error');
      }
    });  

    return this.router;
  }


}  






module.exports = DivisionApi;