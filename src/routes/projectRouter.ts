import { Router, Request, Response, NextFunction } from 'express';
import { PostgresDataAccess } from '../dal/PostgresDataAccess';

export class ProjectRouter {
  public router: Router;
  private dal: PostgresDataAccess;

  /**
   * Construct the Project Router.
   */
  constructor() {
    this.dal = new PostgresDataAccess();
    this.router = Router();
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's endpoints.
   */
  init() {
    this.router.get('/', this.get);
    this.router.get('/:id', this.getOne);
    this.router.put('/:id', this.update);
    this.router.post('/', this.add);
    this.router.delete('/:id', this.delete);
  }

  /**
   * GET: Returns all projects.
   */
  get = (req: Request, res: Response, next: NextFunction) => {
    let projects = this.dal.findMany('select * from projects order by id', null, res);
  }

  /**
   * GET: Retuns one project by id.
   */
  getOne = (req: Request, res: Response, next: NextFunction) => {
    let projects = this.dal.findOne('select * from projects where id = $1', [req.params.id], res);
  }

  update = (req: Request, res: Response, next: NextFunction) => {
    let result = this.dal.update(
      `update projects set
        name = $1,
        description = $2,
        url = $3,
        primary_email = $4,
        slack = $5,
        date_modified = $6
      where id = $7
      returning id`.toString(), [
        req.body.name,
        req.body.description,
        req.body.url,
        req.body.primary_email,
        req.body.slack,
        new Date(),
        req.params.id
      ], res);
  }

  add = (req: Request, res: Response, next: NextFunction) => {
    let result = this.dal.add(
      'insert into projects (name, description, url, primary_email, slack, date_created) values ($1, $2, $3, $4, $5, $6) returning id',
      [
        req.body.name,
        req.body.description,
        req.body.url,
        req.body.primary_email,
        req.body.slack,
        new Date(),
      ],
      res);
  }

  delete = (req: Request, res: Response, next: NextFunction) => {
    let result = this.dal.delete(
      'delete from projects where id = $1', [req.params.id], res);
  }
}

const projectRouter = new ProjectRouter();
export default projectRouter.router;
