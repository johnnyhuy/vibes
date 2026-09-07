import type { AiStyle, DinerDef } from './types';

export const DINERS: readonly DinerDef[] = [
  {
    id: 'ember-fox',
    species: 'fox',
    name: 'Ember Fox',
    nameZh: '焰狐',
    hue: '#c65a2e',
    accent: '#f2c08a',
    lede: 'A russet courier who leans into the steam.',
  },
  {
    id: 'ink-raccoon',
    species: 'raccoon',
    name: 'Ink Raccoon',
    nameZh: '墨浣',
    hue: '#6d717a',
    accent: '#1b1d22',
    lede: 'A masked taster who waits for the gilt coin.',
  },
  {
    id: 'paper-owl',
    species: 'owl',
    name: 'Paper Owl',
    nameZh: '纸鸮',
    hue: '#e7d7b8',
    accent: '#2c241c',
    lede: 'A night host who reads the moon-gate first.',
  },
  {
    id: 'moss-badger',
    species: 'badger',
    name: 'Moss Badger',
    nameZh: '苔獾',
    hue: '#3f4a38',
    accent: '#d9d3c4',
    lede: 'A low, stubborn walker who never skips a pleat.',
  },
  {
    id: 'river-hare',
    species: 'hare',
    name: 'River Hare',
    nameZh: '川兔',
    hue: '#7f93a8',
    accent: '#f4efe6',
    lede: 'A long-eared dash who lives on tea-leaf speed.',
  },
] as const;

export function dinerById(id: string): DinerDef {
  return DINERS.find((diner) => diner.id === id) ?? DINERS[0];
}

export function seatRivals(playerId: string): { dinerId: string; ai: AiStyle }[] {
  const others = DINERS.filter((diner) => diner.id !== playerId);
  return [
    { dinerId: others[0].id, ai: 'orbit' },
    { dinerId: others[1].id, ai: 'savour' },
  ];
}
