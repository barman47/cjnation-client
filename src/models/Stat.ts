

import { Document } from 'mongoose';

// interface for Stat 
export interface StatDocument extends Document {
  name: string;
  type: string;
  created: Date;
}

// Define a class to manage user statistics
export class StatsManager {
  private userStats: StatDocument[];

  constructor() {
    // Initialize user statistics array
    this.userStats = [];
  }

  // Method to update user statistics
  public updateStats(userId: string, _increment: number = 1): void {
    let userStat = this.userStats.find(stat => stat.name === userId);

    if (!userStat) {
      // If user statistics not found, create new entry
      userStat = {
        name: userId,
        type: 'post',
        created: new Date()
      } as StatDocument; // Add type assertion here
      this.userStats.push(userStat);
    } else {
      // If user statistics found, update created timestamp
      userStat.created = new Date();
    }

    // Call a function to update the UI or perform any other action
    this.updateUI(userStat);
  }

  // Method to get user statistics
  public getUserStats(userId: string): StatDocument | undefined {
    return this.userStats.find(stat => stat.name === userId);
  }
  

  // Method to update UI (placeholder, you need to implement this according to your UI framework)
  private updateUI(userStat: StatDocument): void {
    console.log(`User ${userStat.name} has made a post.`);
    
  }
}
