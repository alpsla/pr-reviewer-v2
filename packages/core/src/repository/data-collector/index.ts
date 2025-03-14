import { VCSClient } from '../../vcs/types';
import { generateUuid } from '../../utils/uuid';
import { DataType, DataCollectionJob } from '../types';

/**
 * Service for collecting repository data
 */
export class DataCollectorService {
  constructor(
    private readonly db: any,
    private readonly vcsClient: VCSClient
  ) {}

  /**
   * Create a data collection job
   */
  async createJob(repositoryId: string, dataTypes: DataType[]): Promise<DataCollectionJob> {
    // Create a new job ID
    const jobId = generateUuid();
    
    // Create job in database if it has the method
    try {
      if (this.db.createDataCollectionJob) {
        await this.db.createDataCollectionJob({
          id: jobId,
          repository_id: repositoryId,
          data_types: dataTypes,
          status: 'pending',
          priority: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        console.warn('Database does not have createDataCollectionJob method - job will not be persisted');
      }
    } catch (error) {
      console.error('Error creating data collection job in database:', error);
      // Continue with in-memory job even if DB save fails
    }
    
    // Return the job object
    return {
      id: jobId,
      repositoryId,
      dataTypes,
      status: 'pending',
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      retryCount: 0
    };
  }
  
  /**
   * Process the next pending job in the queue
   * 
   * This is called by the worker to process jobs
   */
  async processNextJob(): Promise<boolean> {
    console.log('Processing next data collection job...');
    
    // Check if the database has the method to get next job
    if (!this.db.getNextDataCollectionJob) {
      console.warn('Database does not have getNextDataCollectionJob method');
      return false;
    }
    
    try {
      // Get the next pending job
      const job = await this.db.getNextDataCollectionJob();
      
      // If no job is available, return false
      if (!job) {
        console.log('No pending data collection jobs found');
        return false;
      }
      
      console.log(`Processing job ${job.id} for repository ${job.repository_id}...`);
      
      // Update job status to processing
      if (this.db.updateDataCollectionJob) {
        await this.db.updateDataCollectionJob(job.id, {
          status: 'processing',
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      // Process each data type in the job
      try {
        let processedCount = 0;
        
        // In a real implementation, we would process each data type
        // For now, just simulate processing with a delay
        for (const dataType of job.data_types) {
          console.log(`Processing data type: ${dataType}...`);
          
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          processedCount++;
        }
        
        console.log(`Successfully processed ${processedCount} data types for job ${job.id}`);
        
        // Update job status to completed
        if (this.db.updateDataCollectionJob) {
          await this.db.updateDataCollectionJob(job.id, {
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
        return true;
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
        
        // Update job status to failed
        if (this.db.updateDataCollectionJob) {
          await this.db.updateDataCollectionJob(job.id, {
            status: 'failed',
            error: error instanceof Error ? error.message : String(error),
            retry_count: (job.retry_count || 0) + 1,
            updated_at: new Date().toISOString()
          });
        }
        
        return false;
      }
    } catch (error) {
      console.error('Error getting next data collection job:', error);
      return false;
    }
  }
}
