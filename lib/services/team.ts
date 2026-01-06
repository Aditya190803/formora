/**
 * Team Service
 * Manages team workspaces, members, and permissions
 */

import { Team, TeamMember, TeamWorkspace, UserRole } from '@/lib/types-extended';

export class TeamService {
  /**
   * Create a new team
   */
  static createTeam(name: string, ownerId: string): Team {
    return {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      ownerId,
      members: [
        {
          id: ownerId,
          email: '', // Will be populated from user data
          role: 'owner',
          addedAt: new Date().toISOString(),
        },
      ],
      forms: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Add team member
   */
  static addTeamMember(
    team: Team,
    email: string,
    role: UserRole = 'viewer'
  ): Team {
    const newMember: TeamMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      role,
      addedAt: new Date().toISOString(),
    };

    return {
      ...team,
      members: [...team.members, newMember],
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Remove team member
   */
  static removeTeamMember(team: Team, memberId: string): Team {
    // Don't allow removing the owner
    const memberToRemove = team.members.find(m => m.id === memberId);
    if (memberToRemove?.role === 'owner') {
      throw new Error('Cannot remove team owner');
    }

    return {
      ...team,
      members: team.members.filter(m => m.id !== memberId),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Update member role
   */
  static updateMemberRole(team: Team, memberId: string, role: UserRole): Team {
    const member = team.members.find(m => m.id === memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    if (member.role === 'owner' && role !== 'owner') {
      throw new Error('Cannot change owner role');
    }

    return {
      ...team,
      members: team.members.map(m =>
        m.id === memberId ? { ...m, role } : m
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get user's role in team
   */
  static getUserRole(team: Team, userId: string): UserRole | null {
    const member = team.members.find(m => m.id === userId);
    return member?.role || null;
  }

  /**
   * Check if user can perform action
   */
  static canPerformAction(
    userRole: UserRole | null,
    action: 'view' | 'edit' | 'delete' | 'manage_members'
  ): boolean {
    if (!userRole) return false;

    switch (action) {
      case 'view':
        return ['owner', 'editor', 'viewer', 'analyst'].includes(userRole);
      case 'edit':
        return ['owner', 'editor'].includes(userRole);
      case 'delete':
        return ['owner'].includes(userRole);
      case 'manage_members':
        return ['owner'].includes(userRole);
      default:
        return false;
    }
  }

  /**
   * Create team workspace
   */
  static createTeamWorkspace(teamId: string, name: string): TeamWorkspace {
    return {
      id: `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teamId,
      name,
      forms: [],
      createdAt: new Date().toISOString(),
    };
  }
}
