export interface LaunchGames {
  operatorcode: string;
  providercode: string;
  username: string;
  password: string;
  type: string;
  gameid?: string;
  lang?: string;
  html5?: string; //html5=0, for flash(not mobile friendly) or html5=1, for html5(mobile friendly)
  signature: string;
  blimit?: string;
}
