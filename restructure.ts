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
    sourceFile.move(newPath);
  } else {
    console.log(`Source file not found: ${oldPath}`);
  }
}

// 1. Move components
moveFile('src/components/ConfirmModal.tsx', 'src/components/common/modal/ConfirmModal.tsx');
moveFile('src/components/TabButton.tsx', 'src/components/common/bottom-navigation/TabButton.tsx');
moveFile('src/components/ProductCard.tsx', 'src/components/product/ProductCard.tsx');
moveFile('src/components/ProductListItem.tsx', 'src/components/product/ProductListItem.tsx');
moveFile('src/components/ExploreIcon.tsx', 'src/components/common/ExploreIcon.tsx');

// 2. Move screens to app router structure
moveFile('src/screens/LoginScreen.tsx', 'src/app/(auth)/login/page.tsx');
moveFile('src/screens/SignupScreen.tsx', 'src/app/(auth)/signup/page.tsx');
moveFile('src/screens/FindIdScreen.tsx', 'src/app/(auth)/find-id/page.tsx');
moveFile('src/screens/FindPasswordScreen.tsx', 'src/app/(auth)/find-password/page.tsx');
moveFile('src/screens/RegionSetupScreen.tsx', 'src/app/(auth)/region-setup/page.tsx');
moveFile('src/screens/FindLocationScreen.tsx', 'src/app/(auth)/find-location/page.tsx');
moveFile('src/screens/PhoneAuthScreen.tsx', 'src/app/(auth)/phone-auth/page.tsx');
moveFile('src/screens/TermsAgreementScreen.tsx', 'src/app/(auth)/terms/page.tsx');
moveFile('src/screens/ProfileSetupScreen.tsx', 'src/app/(auth)/profile-setup/page.tsx');
moveFile('src/screens/CategorySelectionScreen.tsx', 'src/app/(auth)/category-selection/page.tsx');

moveFile('src/screens/MainLayout.tsx', 'src/app/(main)/layout.tsx');
moveFile('src/screens/HomeScreen.tsx', 'src/app/(main)/home/page.tsx');
moveFile('src/screens/SearchScreen.tsx', 'src/app/(main)/search/page.tsx');
moveFile('src/screens/SearchDetailScreen.tsx', 'src/app/(main)/search/detail/page.tsx');
moveFile('src/screens/WishlistScreen.tsx', 'src/app/(main)/wishlist/page.tsx');
moveFile('src/screens/NotificationScreen.tsx', 'src/app/(main)/notifications/page.tsx');
moveFile('src/screens/NotificationSettingsScreen.tsx', 'src/app/(main)/notifications/settings/page.tsx');
moveFile('src/screens/MyPageScreen.tsx', 'src/app/(main)/mypage/page.tsx');
moveFile('src/screens/AccountManagementScreen.tsx', 'src/app/(main)/mypage/account-management/page.tsx');
moveFile('src/screens/PurchaseHistoryScreen.tsx', 'src/app/(main)/mypage/purchase-history/page.tsx');
moveFile('src/screens/SalesHistoryScreen.tsx', 'src/app/(main)/mypage/sales-history/page.tsx');
moveFile('src/screens/SalesManagementScreen.tsx', 'src/app/(main)/mypage/sales-management/page.tsx');
moveFile('src/screens/MyBidsScreen.tsx', 'src/app/(main)/mypage/my-bids/page.tsx');
moveFile('src/screens/ReviewScreen.tsx', 'src/app/(main)/mypage/review/page.tsx');
moveFile('src/screens/WriteReviewScreen.tsx', 'src/app/(main)/mypage/review/write/page.tsx');

moveFile('src/screens/ProductListScreen.tsx', 'src/app/products/page.tsx');
moveFile('src/screens/RegisterScreen.tsx', 'src/app/products/register/page.tsx');
moveFile('src/screens/ProductDetailScreen.tsx', 'src/app/products/[productId]/page.tsx');
moveFile('src/screens/ReportScreen.tsx', 'src/app/products/[productId]/report/page.tsx');
moveFile('src/screens/RegularPurchaseScreen.tsx', 'src/app/products/[productId]/regular-purchase/page.tsx');
moveFile('src/screens/PaymentScreen.tsx', 'src/app/products/[productId]/payment/page.tsx');
moveFile('src/screens/ReceiptScreen.tsx', 'src/app/products/[productId]/receipt/page.tsx');

moveFile('src/screens/BiddingStatusScreen.tsx', 'src/app/auctions/[auctionId]/bidding-status/page.tsx');
moveFile('src/screens/BidPlacementCompleteScreen.tsx', 'src/app/auctions/[auctionId]/bid-complete/page.tsx');
moveFile('src/screens/WinningBidCompletionScreen.tsx', 'src/app/auctions/[auctionId]/winning-complete/page.tsx');
moveFile('src/screens/OutbidNotificationScreen.tsx', 'src/app/auctions/[auctionId]/outbid/page.tsx');

moveFile('src/screens/ChatListScreen.tsx', 'src/app/chats/page.tsx');
moveFile('src/screens/ChatRoomScreen.tsx', 'src/app/chats/[roomId]/page.tsx');

// 3. Move App.tsx to src/app/page.tsx
moveFile('src/App.tsx', 'src/app/page.tsx');

project.saveSync();
console.log('Done moving files with ts-morph');
