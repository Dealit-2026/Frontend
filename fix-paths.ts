import { Project } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

function moveFile(oldPath: string, newPath: string) {
  const sourceFile = project.getSourceFile(oldPath);
  if (sourceFile) {
    console.log(`Moving ${oldPath} to ${newPath}`);
    const dir = path.dirname(newPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Use absolute path for moving
    sourceFile.move(path.resolve(newPath));
  } else {
    console.log(`Source file not found: ${oldPath}`);
  }
}

// 1. Move components
moveFile('src/components/src/components/common/modal/ConfirmModal.tsx', 'src/components/common/modal/ConfirmModal.tsx');
moveFile('src/components/src/components/common/bottom-navigation/TabButton.tsx', 'src/components/common/bottom-navigation/TabButton.tsx');
moveFile('src/components/src/components/product/ProductCard.tsx', 'src/components/product/ProductCard.tsx');
moveFile('src/components/src/components/product/ProductListItem.tsx', 'src/components/product/ProductListItem.tsx');
moveFile('src/components/src/components/common/ExploreIcon.tsx', 'src/components/common/ExploreIcon.tsx');

// 2. Move screens to app router structure
moveFile('src/screens/src/app/(auth)/login/page.tsx', 'src/app/(auth)/login/page.tsx');
moveFile('src/screens/src/app/(auth)/signup/page.tsx', 'src/app/(auth)/signup/page.tsx');
moveFile('src/screens/src/app/(auth)/find-id/page.tsx', 'src/app/(auth)/find-id/page.tsx');
moveFile('src/screens/src/app/(auth)/find-password/page.tsx', 'src/app/(auth)/find-password/page.tsx');
moveFile('src/screens/src/app/(auth)/region-setup/page.tsx', 'src/app/(auth)/region-setup/page.tsx');
moveFile('src/screens/src/app/(auth)/find-location/page.tsx', 'src/app/(auth)/find-location/page.tsx');
moveFile('src/screens/src/app/(auth)/phone-auth/page.tsx', 'src/app/(auth)/phone-auth/page.tsx');
moveFile('src/screens/src/app/(auth)/terms/page.tsx', 'src/app/(auth)/terms/page.tsx');
moveFile('src/screens/src/app/(auth)/profile-setup/page.tsx', 'src/app/(auth)/profile-setup/page.tsx');
moveFile('src/screens/src/app/(auth)/category-selection/page.tsx', 'src/app/(auth)/category-selection/page.tsx');

moveFile('src/screens/src/app/(main)/layout.tsx', 'src/app/(main)/layout.tsx');
moveFile('src/screens/src/app/(main)/home/page.tsx', 'src/app/(main)/home/page.tsx');
moveFile('src/screens/src/app/(main)/search/page.tsx', 'src/app/(main)/search/page.tsx');
moveFile('src/screens/src/app/(main)/search/detail/page.tsx', 'src/app/(main)/search/detail/page.tsx');
moveFile('src/screens/src/app/(main)/wishlist/page.tsx', 'src/app/(main)/wishlist/page.tsx');
moveFile('src/screens/src/app/(main)/notifications/page.tsx', 'src/app/(main)/notifications/page.tsx');
moveFile('src/screens/src/app/(main)/notifications/settings/page.tsx', 'src/app/(main)/notifications/settings/page.tsx');
moveFile('src/screens/src/app/(main)/mypage/page.tsx', 'src/app/(main)/mypage/page.tsx');
moveFile('src/screens/src/app/(main)/mypage/account-management/page.tsx', 'src/app/(main)/mypage/account-management/page.tsx');
moveFile('src/screens/src/app/(main)/mypage/purchase-history/page.tsx', 'src/app/(main)/mypage/purchase-history/page.tsx');
moveFile('src/screens/src/app/(main)/mypage/sales-history/page.tsx', 'src/app/(main)/mypage/sales-history/page.tsx');
moveFile('src/screens/src/app/(main)/mypage/sales-management/page.tsx', 'src/app/(main)/mypage/sales-management/page.tsx');
moveFile('src/screens/src/app/(main)/mypage/my-bids/page.tsx', 'src/app/(main)/mypage/my-bids/page.tsx');
moveFile('src/screens/src/app/(main)/mypage/review/page.tsx', 'src/app/(main)/mypage/review/page.tsx');
moveFile('src/screens/src/app/(main)/mypage/review/write/page.tsx', 'src/app/(main)/mypage/review/write/page.tsx');

moveFile('src/screens/src/app/products/page.tsx', 'src/app/products/page.tsx');
moveFile('src/screens/src/app/products/register/page.tsx', 'src/app/products/register/page.tsx');
moveFile('src/screens/src/app/products/[productId]/page.tsx', 'src/app/products/[productId]/page.tsx');
moveFile('src/screens/src/app/products/[productId]/report/page.tsx', 'src/app/products/[productId]/report/page.tsx');
moveFile('src/screens/src/app/products/[productId]/regular-purchase/page.tsx', 'src/app/products/[productId]/regular-purchase/page.tsx');
moveFile('src/screens/src/app/products/[productId]/payment/page.tsx', 'src/app/products/[productId]/payment/page.tsx');
moveFile('src/screens/src/app/products/[productId]/receipt/page.tsx', 'src/app/products/[productId]/receipt/page.tsx');

moveFile('src/screens/src/app/auctions/[auctionId]/bidding-status/page.tsx', 'src/app/auctions/[auctionId]/bidding-status/page.tsx');
moveFile('src/screens/src/app/auctions/[auctionId]/bid-complete/page.tsx', 'src/app/auctions/[auctionId]/bid-complete/page.tsx');
moveFile('src/screens/src/app/auctions/[auctionId]/winning-complete/page.tsx', 'src/app/auctions/[auctionId]/winning-complete/page.tsx');
moveFile('src/screens/src/app/auctions/[auctionId]/outbid/page.tsx', 'src/app/auctions/[auctionId]/outbid/page.tsx');

moveFile('src/screens/src/app/chats/page.tsx', 'src/app/chats/page.tsx');
moveFile('src/screens/src/app/chats/[roomId]/page.tsx', 'src/app/chats/[roomId]/page.tsx');

// 3. Move App.tsx to src/app/page.tsx
moveFile('src/src/app/page.tsx', 'src/app/page.tsx');

project.saveSync();
console.log('Done moving files with ts-morph');
