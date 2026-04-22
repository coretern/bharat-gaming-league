import { useMemo } from 'react';
import { Reg, Tournament } from '@/components/types/admin';
import { FullGroupInfo } from '@/components/admin/Registrations/FullGroupsBanner';

/**
 * Identifies groups that are full but NOT yet scheduled.
 * These are candidates for auto-scheduling prompt.
 */
export const useFullGroups = (
  registrations: Reg[],
  liveTournaments: Tournament[]
): FullGroupInfo[] => {
  return useMemo(() => {
    // Group by tournament + groupNumber
    const groupMap: Record<string, { tourName: string; tourId?: string; gNum: number; regs: Reg[] }> = {};

    registrations.forEach(r => {
      if (!r.tournamentName || !r.groupNumber) return;
      const key = `${r.tournamentName}__${r.groupNumber}`;
      if (!groupMap[key]) {
        groupMap[key] = {
          tourName: r.tournamentName,
          tourId: r.tournamentId,
          gNum: r.groupNumber,
          regs: []
        };
      }
      groupMap[key].regs.push(r);
    });

    const fullGroups: FullGroupInfo[] = [];

    Object.values(groupMap).forEach(({ tourName, tourId, gNum, regs }) => {
      // Skip groups that are already scheduled
      const isScheduled = regs.some(r => !!r.matchDate);
      if (isScheduled) return;

      // Determine target from tournament slots config
      const tournament = liveTournaments.find(t => t.title === tourName);
      const gameType = tournament?.game || (tourName.toLowerCase().includes('bgmi') ? 'BGMI' : 'Free Fire');

      let target = 48;
      if (tournament?.slots) {
        const parts = tournament.slots.split('/');
        const parsed = parseInt(parts[parts.length - 1]);
        if (!isNaN(parsed)) target = parsed;
      } else if (gameType === 'BGMI') {
        target = 94;
      }

      const totalCount = regs.length;
      if (totalCount >= target) {
        fullGroups.push({
          tournamentName: tourName,
          tournamentId: tourId,
          groupNumber: gNum,
          totalCount,
          target,
          gameType
        });
      }
    });

    // Sort by tournament name then group number
    return fullGroups.sort((a, b) => {
      const nameCmp = a.tournamentName.localeCompare(b.tournamentName);
      return nameCmp !== 0 ? nameCmp : a.groupNumber - b.groupNumber;
    });
  }, [registrations, liveTournaments]);
};
