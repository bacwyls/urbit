import { Poke } from '../lib'
import { Belt, Task, SessionTask } from './types';

export const pokeTask = (session: string, task: Task): Poke<SessionTask> => ({
  app: 'herm',
  mark: 'herm-task',
  json: { session, ...task }
});

export const pokeBelt = (
  session: string,
  belt: Belt
): Poke<SessionTask> => pokeTask(session, { belt });

//NOTE  scry will return string[]
// export const scrySessions = (): Scry => ({
//   app: 'herm',
//   path: `/sessions`
// });
//TODO  remove stub once new backend lands
export const scrySessions = (): string[] => [''];
