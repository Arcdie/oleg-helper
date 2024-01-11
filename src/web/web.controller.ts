import { Request, Response } from 'express';

class WebController {
  getMainPage(req: Request, res: Response) {
    res.render('web/main');
  }
}

export const webController = new WebController();
