import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
      <Card className="glass-card w-full max-w-xl text-center">
        <CardHeader>
          <CardTitle className="text-4xl">404</CardTitle>
          <CardDescription>
            The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFoundPage;
