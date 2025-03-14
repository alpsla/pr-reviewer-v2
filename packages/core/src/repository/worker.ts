import { DataCollectorService } from './data-collector';
import { sleep } from '../utils/sleep';

/**
 * Start a background worker for processing data collection jobs
 * 
 * @param dataCollector The data collector service
 * @param pollingInterval Interval in milliseconds between job checks
 * @param maxConcurrent Maximum number of concurrent jobs
 */
export async function startWorker(
  dataCollector: DataCollectorService,
  pollingInterval = 5000,
  maxConcurrent = 3
): Promise<() => Promise<void>> {
  console.log('Starting data collection worker...');
  
  let activeJobs = 0;
  let stopping = false;
  
  // Process a single job
  async function processJob() {
    if (stopping) return;
    
    try {
      activeJobs++;
      await dataCollector.processNextJob();
    } catch (error) {
      console.error('Error processing job:', error);
    } finally {
      activeJobs--;
    }
  }
  
  // Start the worker loop
  const workerPromise = (async () => {
    while (!stopping) {
      if (activeJobs < maxConcurrent) {
        processJob();
      }
      
      await sleep(pollingInterval);
    }
    
    // Wait for active jobs to complete before shutdown
    console.log(`Worker shutting down, waiting for ${activeJobs} active jobs to complete...`);
    while (activeJobs > 0) {
      await sleep(1000);
    }
    
    console.log('Worker shutdown complete');
  })();
  
  // Return a function to stop the worker
  return async () => {
    console.log('Stopping data collection worker...');
    stopping = true;
    await workerPromise;
  };
}
