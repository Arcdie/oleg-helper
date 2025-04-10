import { Request, Response } from 'express';

class WebController {
  getMainPage(req: Request, res: Response) {
    res.render('web/main');
  }

  getShopsPage(req: Request, res: Response) {
    res.render('web/shops');
  }
}

export const webController = new WebController();
