import { Pipe, PipeTransform } from '@angular/core';
import { Match } from '../models/match.models';

@Pipe({
  name: 'matchFilter'
})
export class MatchFilterPipe implements PipeTransform {
  transform(matches: Match[], selectedType: string): Match[] {
    if (!matches) {
      return [];
    }
    if (!selectedType) {
      return matches;
    }
    return matches.filter(match => match.type === selectedType);
  }
}
