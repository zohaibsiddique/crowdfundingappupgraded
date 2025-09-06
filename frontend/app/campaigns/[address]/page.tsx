import { createPublicClient, http, formatEther } from 'viem';
import { localhost, sepolia } from 'viem/chains';
import { CROWDFUNDING_ABI } from '@/app/contract-utils/crowdfunding-abi';
import NavBarCampaigns from '@/components/nav-bar-campaigns';

const client = createPublicClient({
  chain: sepolia || localhost,
  transport: http(),
});

export default async function CampaignPage({ params }: { params: { address: `0x${string}` } }) {
  const { address } = await params;
  const abi = CROWDFUNDING_ABI;

  const [
    name,
    description,
    minGoal,
    maxGoal,
    deadline,
    owner,
    paused,
    status,
    tiers,
    ] = await Promise.all([
        client.readContract({ address, abi, functionName: 'name' }) as Promise<string>,
        client.readContract({ address, abi, functionName: 'description' }) as Promise<string>,
        client.readContract({ address, abi, functionName: 'minGoal' }) as Promise<bigint>,
        client.readContract({ address, abi, functionName: 'maxGoal' }) as Promise<bigint>,
        client.readContract({ address, abi, functionName: 'deadline' }) as Promise<bigint>,
        client.readContract({ address, abi, functionName: 'owner' }) as Promise<`0x${string}`>,
        client.readContract({ address, abi, functionName: 'paused' }) as Promise<boolean>,
        client.readContract({ address, abi, functionName: 'getCampaignStatus' }) as Promise<number>,
        client.readContract({ address, abi, functionName: 'getTiers' }) as Promise<Array<{ amount: bigint; description: string }>>,
    ]);

    const balance = await client.getBalance({ address });

    return (
        <>
            <NavBarCampaigns />
             <div>
                <h1>{name}</h1>
                <p>{description}</p>
                <p><strong>Address:</strong> {address}</p>
                <p><strong>Balance:</strong> {formatEther(balance)} ETH</p>
                <p><strong>Minimum Goal:</strong> {formatEther(minGoal)} ETH</p>
                <p><strong>Maximum Goal:</strong> {formatEther(maxGoal)} ETH</p>
                <p><strong>Deadline:</strong> {new Date(Number(deadline) * 1000).toLocaleString()}</p>
                <p><strong>Owner:</strong> {owner}</p>
                <p><strong>Paused:</strong> {paused ? 'Yes' : 'No'}</p>
                <p><strong>Status:</strong> {status === 0 ? 'Ongoing' : status === 1 ? 'Successful' : 'Failed'}</p>
                <h2>Tiers</h2>
                <ul>
                    {tiers.map((tier, index) => (
                        <li key={index}>
                            <p><strong>Amount:</strong> {formatEther(tier.amount)} ETH</p>
                            <p><strong>Description:</strong> {tier.description}</p>
                        </li>
                    ))}
                </ul>

            </div>
            
        </>
       
    );
}
