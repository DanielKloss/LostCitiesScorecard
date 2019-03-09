import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: './home/home.module#HomePageModule' },
    { path: 'rules', loadChildren: './rules/rules.module#RulesPageModule' },
    { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
    { path: 'start', loadChildren: './start/start.module#StartPageModule' },
    { path: 'scoreboard/:p1/:p2/:gt', loadChildren: './scoreboard/scoreboard.module#ScoreboardPageModule' },
    { path: 'standings/:dt', loadChildren: './standings/standings.module#StandingsPageModule' },
    { path: 'stats', loadChildren: './stats/stats.module#StatsPageModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
