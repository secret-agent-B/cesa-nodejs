import { Router, Request, Response, NextFunction } from 'express';
import { PostgresDataAccess } from '../dal/PostgresDataAccess';

export class IssueRouter {
  public router: Router;
  private dal: PostgresDataAccess;

  /**
   * Construct the Issue/Ideas Router.
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
   * GET: Returns all issues.
   */
  get = (req: Request, res: Response, next: NextFunction) => {
    let issues = this.dal.findMany('select * from issues order by id', null, res);
  }

  /**
   * GET: Retuns one issue by id.
   */
  getOne = (req: Request, res: Response, next: NextFunction) => {
    let issues = this.dal.findOne('select * from issues where id = $1', [req.params.id], res);
  }

  /**
   * Update an existing issue.
   */
  update = (req: Request, res: Response, next: NextFunction) => {
    let result = this.dal.update(
      `update issues set
        title = $1,
        description = $2,
        submitter_id = $3,
        category_id = $4,
        project_id = $5,
        status_id = $6,
        priority = $7,
        date_needed = $8,
        date_modified = $9
      where id = $10
      returning id`, [
        req.body.title,
        req.body.description,
        req.body.submitter_id,
        req.body.category_id,
        req.body.project_id,
        req.body.status_id,
        req.body.priority,
        req.body.date_needed,
        new Date(),
        req.params.id,
      ], res);
  }

  /**
   * Add a new issue into the table.
   */
  add = (req: Request, res: Response, next: NextFunction) => {
    let result = this.dal.add(
      `insert into issues (
        title,
        description,
        submitter_id,
        project_id,
        category_id,
        status_id,
        priority,
        date_needed,
        date_created)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning id`,
      [
        req.body.title,
        req.body.description,
        req.body.submitter_id,
        req.body.project_id,
        req.body.category_id,
        req.body.status_id,
        req.body.priority,
        req.body.date_needed,
        new Date()
      ],
      res);
  }

  /**
   * Delete an issue form the table.
   */
  delete = (req: Request, res: Response, next: NextFunction) => {
    let result = this.dal.delete(
      'delete from issues where id = $1', [req.params.id], res);
  }
}

const issueRouter = new IssueRouter();
export default issueRouter.router;
